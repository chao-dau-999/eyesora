package vn.edu.fpt.eyesora.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import vn.edu.fpt.eyesora.dto.request.PatientRequest;
import vn.edu.fpt.eyesora.dto.response.PatientResponse;
import vn.edu.fpt.eyesora.entity.Classes;
import vn.edu.fpt.eyesora.entity.ExamCampaign;
import vn.edu.fpt.eyesora.entity.Facility;
import vn.edu.fpt.eyesora.entity.Patient;
import vn.edu.fpt.eyesora.exceptions.BusinessException;
import vn.edu.fpt.eyesora.repository.CampaignRepository;
import vn.edu.fpt.eyesora.repository.ClassesRepository;
import vn.edu.fpt.eyesora.repository.FacilityRepository;
import vn.edu.fpt.eyesora.repository.PatientRepository;
import vn.edu.fpt.eyesora.service.IPatientService;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PatientServiceImpl implements IPatientService {

    private final PatientRepository patientRepository;
    private final CampaignRepository campaignRepository;
    private final FacilityRepository facilityRepository;
    private final ClassesRepository classesRepository;

    @Override
    public Page<PatientResponse> getPatients(String wardId, String name, Integer birthYear, Pageable pageable) {
        Specification<Patient> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (wardId != null && !wardId.isEmpty()) {
                predicates.add(cb.equal(root.get("ward").get("id"), wardId));
            }

            predicates.add(cb.equal(root.get("isDeleted"), false));

            if (name != null && !name.isEmpty()) {
                predicates.add(cb.like(root.get("patientName"), "%" + name + "%"));
            }

            if (birthYear != null) {
                predicates.add(cb.between(root.get("dob"),
                        LocalDate.of(birthYear, 1, 1),
                        LocalDate.of(birthYear, 12, 31)));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return patientRepository.findAll(spec, pageable).map(this::convertToDto);
    }

    @Override
    public PatientResponse getPatientById(String id) {
        Patient patient = patientRepository.findByPatientId(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with ID: " + id));

        return convertToDto(patient);
    }
    private PatientResponse convertToDto(Patient p) {
        return new PatientResponse(
                p.getPatientId(),
                p.getPatientName(),
                p.getClasses() != null ? p.getClasses().getClassName() : "N/A",
                p.getDob(),
                p.getGender() != null ? p.getGender().name() : null,
                p.getParentPhone(),
                p.getWard() != null ? p.getWard().getWardName() : null
        );
    }

    @Override
    public void createPatient(PatientRequest req) {
        ExamCampaign campaign = campaignRepository.findById(req.campaignId())
                .orElseThrow(() -> new RuntimeException("Campaign not found with ID: " + req.campaignId()));

        if (campaign.getStatus() == ExamCampaign.CampaignStatus.LOCKED) {
            throw new BusinessException("Cannot add patient! This campaign is already locked.");
        }

        Facility facility = facilityRepository.findById(req.facilityId())
                .orElseThrow(() -> new RuntimeException("School not found with ID: " + req.facilityId()));

        Classes patientClass = classesRepository.findById(req.classId())
                .orElseThrow(() -> new RuntimeException("Class not found with ID: " + req.classId()));

        Patient patient = new Patient();
        patient.setPatientName(req.patientName());
        patient.setDob(req.dob());
        patient.setGender(Patient.Gender.valueOf(req.gender().toUpperCase()));
        patient.setParentPhone(req.parentPhone());
        patient.setIsDeleted(false);
        patient.setExamCampaign(campaign);
        patient.setFacility(facility);
        patient.setClasses(patientClass);
        patient.setWard(facility.getWard());

        patientRepository.save(patient);
    }

    @Override
    public Integer countPatientsByCampaign(String campaignId) {
        return patientRepository.countByExamCampaign_CampaignIdAndIsDeletedFalse(campaignId);
    }
}