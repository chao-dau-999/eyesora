package vn.edu.fpt.eyesora.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.fpt.eyesora.dto.request.PatientRequest;
import vn.edu.fpt.eyesora.dto.response.PatientResponse;
import vn.edu.fpt.eyesora.entity.*;
import vn.edu.fpt.eyesora.exceptions.BusinessException;
import vn.edu.fpt.eyesora.exceptions.ResourceNotFoundException;
import vn.edu.fpt.eyesora.repository.*;
import vn.edu.fpt.eyesora.service.IPatientService;

import jakarta.persistence.criteria.Predicate;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PatientServiceImpl implements IPatientService {

    private final PatientRepository patientRepository;
    private final CampaignRepository campaignRepository;
    private final FacilityRepository facilityRepository;
    private final ClassesRepository classesRepository;
    private final WardRepository wardRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<PatientResponse> getPatients(String wardId, String name, Integer birthYear, Pageable pageable) {
        Specification<Patient> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();
            if (wardId != null && !wardId.isEmpty()) {
                predicates.add(cb.equal(root.get("facility").get("ward").get("id"), wardId));
            }

            predicates.add(cb.equal(root.get("isDeleted"), false));
            if (name != null && !name.isEmpty()) predicates.add(cb.like(root.get("patientName"), "%" + name + "%"));
            if (birthYear != null) {
                predicates.add(cb.between(root.get("dob"), LocalDate.of(birthYear, 1, 1), LocalDate.of(birthYear, 12, 31)));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };
        return patientRepository.findAll(spec, pageable).map(this::convertToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientResponse getPatientById(String id) {
        return patientRepository.findByPatientId(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));
    }

    @Override
    public void createPatient(PatientRequest req) {
        ExamCampaign campaign = campaignRepository.findById(req.campaignId())
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found: " + req.campaignId()));

        if (campaign.getStatus() == ExamCampaign.CampaignStatus.LOCKED)
            throw new BusinessException("Campaign is locked!");

        Facility facility = facilityRepository.findById(req.facilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found: " + req.facilityId()));

        Classes patientClass = classesRepository.findById(req.classId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found: " + req.classId()));

        Patient patient = new Patient();
        patient.setPatientName(req.patientName());
        patient.setDob(req.dob());
        patient.setGender(Patient.Gender.valueOf(req.gender().toUpperCase()));
        patient.setParentPhone(req.parentPhone());

        patient.setExamCampaign(campaign);
        patient.setFacility(facility);
        patient.setClasses(patientClass);

        patient.setIsDeleted(false);

        patientRepository.save(patient);
    }

//    @Override
//    public void updatePatient(String id, PatientRequest req) {
//        Patient existing = patientRepository.findByPatientId(id)
//                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));
//
//        if (existing.getExamCampaign() != null &&
//                existing.getExamCampaign().getStatus() == ExamCampaign.CampaignStatus.LOCKED) {
//            throw new BusinessException("Cannot edit patient! This campaign is locked.");
//        }
//
//        existing.setPatientName(req.patientName());
//        existing.setDob(req.dob());
//        existing.setGender(Patient.Gender.valueOf(req.gender().toUpperCase()));
//        existing.setParentPhone(req.parentPhone());
//
//        if (existing.getExamCampaign() == null || !existing.getExamCampaign().getCampaignId().equals(req.campaignId())) {
//            existing.setExamCampaign(campaignRepository.findById(req.campaignId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Campaign not found")));
//        }
//
//        if (existing.getFacility() == null || !existing.getFacility().getId().equals(req.facilityId())) {
//            Facility facility = facilityRepository.findById(req.facilityId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Facility not found"));
//            existing.setFacility(facility);
//        }
//
//        if (existing.getClasses() == null || !existing.getClasses().getId().equals(req.classId())) {
//            existing.setClasses(classesRepository.findById(req.classId())
//                    .orElseThrow(() -> new ResourceNotFoundException("Class not found")));
//        }
//
//        patientRepository.save(existing);
//    }

    private PatientResponse convertToDto(Patient p) {
        String wardName = (p.getFacility() != null && p.getFacility().getWard() != null)
                ? p.getFacility().getWard().getWardName()
                : "N/A";

        return new PatientResponse(
                p.getPatientId(),
                p.getPatientName(),
                p.getClasses() != null ? p.getClasses().getId() : null,
                p.getClasses() != null ? p.getClasses().getClassName() : null,
                p.getFacility() != null ? p.getFacility().getId() : null,
                p.getFacility() != null ? p.getFacility().getFacilityName() : null,
                p.getExamCampaign() != null ? p.getExamCampaign().getCampaignId() : null,
                p.getDob(),
                p.getGender() != null ? p.getGender().name() : null,
                p.getParentPhone(),
                wardName
        );
    }

    @Override
    public Integer countPatientsByCampaign(String campaignId) {
        return patientRepository.countByExamCampaign_CampaignIdAndIsDeletedFalse(campaignId);
    }

    @Override
    @Transactional
    public PatientResponse updatePatient(String id, PatientRequest req) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Patient not found with ID: " + id));

        System.out.println("Updating patient with ID: " + id);
        ExamCampaign campaign = campaignRepository.findById(req.campaignId())
                .orElseThrow(() -> new ResourceNotFoundException("Campaign not found with ID: " + req.campaignId()));

        System.out.println("Updating campaign with ID: " + req.campaignId());

        if (campaign.getStatus() == ExamCampaign.CampaignStatus.LOCKED) {
            throw new BusinessException("Cannot update patient! This campaign is already locked.");
        }

        Facility facility = facilityRepository.findById(req.facilityId())
                .orElseThrow(() -> new ResourceNotFoundException("School not found with ID: " + req.facilityId()));

        Classes patientClass = classesRepository.findById(req.classId())
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with ID: " + req.classId()));

        Ward patientWard = wardRepository.findById(req.wardId())
                .orElseThrow(() -> new ResourceNotFoundException("Ward not found"));

        patient.setPatientName(req.patientName());
        patient.setDob(req.dob());
        patient.setGender(Patient.Gender.valueOf(req.gender().toUpperCase()));
        patient.setParentPhone(req.parentPhone());

        patient.setExamCampaign(campaign);
        patient.setFacility(facility);
        patient.setClasses(patientClass);
        patient.setWard(patientWard);

        System.out.println("Patient updated with new details: " + patient);

        Patient updatedPatient = patientRepository.save(patient);
        return convertToDto(updatedPatient);
    }
}