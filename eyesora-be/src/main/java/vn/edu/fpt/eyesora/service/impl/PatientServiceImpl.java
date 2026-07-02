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
                predicates.add(cb.equal(root.get("ward").get("id"), wardId));
            }

            predicates.add(cb.equal(root.get("isDeleted"), false));

            if (name != null && !name.isEmpty())
                predicates.add(cb.like(root.get("patientName"), "%" + name + "%"));

            if (birthYear != null) {
                predicates.add(cb.between(
                        root.get("dob"),
                        LocalDate.of(birthYear, 1, 1),
                        LocalDate.of(birthYear, 12, 31)
                ));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return patientRepository.findAll(spec, pageable)
                .map(this::convertToDto);
    }

    @Override
    @Transactional(readOnly = true)
    public PatientResponse getPatientById(String id) {
        return patientRepository.findByPatientId(id)
                .map(this::convertToDto)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bệnh nhân với ID: " + id));
    }

    @Override
    public void createPatient(PatientRequest req) {

        ExamCampaign campaign = campaignRepository.findById(req.campaignId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chiến dịch: " + req.campaignId()));

        if (campaign.getStatus() == ExamCampaign.CampaignStatus.LOCKED)
            throw new BusinessException("Chiến dịch đã bị khóa!");

        Facility facility = facilityRepository.findById(req.facilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cơ sở: " + req.facilityId()));

        Classes patientClass = classesRepository.findById(req.classId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp: " + req.classId()));

        Ward patientWard = null;
        if (req.wardId() != null && !req.wardId().isBlank()) {
            patientWard = wardRepository.findById(req.wardId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phường/xã: " + req.wardId()));
        }

        Patient patient = new Patient();

        patient.setPatientName(req.patientName());
        patient.setDob(req.dob());
        patient.setGender(Patient.Gender.valueOf(req.gender().toUpperCase()));
        patient.setParentPhone(req.parentPhone());

        patient.setExamCampaign(campaign);
        patient.setFacility(facility);
        patient.setWard(patientWard);
        patient.setClasses(patientClass);

        patient.setIsDeleted(false);

        patientRepository.save(patient);
    }

    @Override
    public Integer countPatientsByCampaign(String campaignId) {
        return patientRepository.countByExamCampaign_CampaignIdAndIsDeletedFalse(campaignId);
    }

    @Override
    @Transactional
    public PatientResponse updatePatient(String id, PatientRequest req) {

        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bệnh nhân với ID: " + id));

        System.out.println("Đang cập nhật bệnh nhân với ID: " + id);

        ExamCampaign campaign = campaignRepository.findById(req.campaignId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chiến dịch với ID: " + req.campaignId()));

        System.out.println("Đang cập nhật chiến dịch với ID: " + req.campaignId());

        if (campaign.getStatus() == ExamCampaign.CampaignStatus.LOCKED) {
            throw new BusinessException("Không thể cập nhật bệnh nhân! Chiến dịch này đã bị khóa.");
        }

        Facility facility = facilityRepository.findById(req.facilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy trường học với ID: " + req.facilityId()));

        Classes patientClass = classesRepository.findById(req.classId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp với ID: " + req.classId()));

        Ward patientWard = null;
        if (req.wardId() != null && !req.wardId().isBlank()) {
            patientWard = wardRepository.findById(req.wardId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy phường/xã: " + req.wardId()));
        }

        patient.setPatientName(req.patientName());
        patient.setDob(req.dob());
        patient.setGender(Patient.Gender.valueOf(req.gender().toUpperCase()));
        patient.setParentPhone(req.parentPhone());
        patient.setExamCampaign(campaign);
        patient.setFacility(facility);
        patient.setClasses(patientClass);
        patient.setWard(patientWard);
        System.out.println("Đã cập nhật thông tin mới của bệnh nhân: " + patient);
        Patient updatedPatient = patientRepository.save(patient);

        return convertToDto(updatedPatient);
    }

    @Override
    @Transactional
    public void deletePatient(String id) {
        Patient patient = patientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy bệnh nhân với ID: " + id));

        if (patient.getExamCampaign() != null &&
                patient.getExamCampaign().getStatus() == ExamCampaign.CampaignStatus.LOCKED) {
            throw new BusinessException("Không thể xóa! Chiến dịch đã bị khóa.");
        }

        patient.setIsDeleted(true);
        patientRepository.save(patient);
    }

    private PatientResponse convertToDto(Patient p) {

        String wardId = p.getWard() != null ? p.getWard().getId() : null;
        String wardName = p.getWard() != null ? p.getWard().getWardName() : "Chưa cập nhật";

        return new PatientResponse(
                p.getPatientId(),
                p.getPatientName(),
                p.getClasses() != null ? p.getClasses().getId() : null,
                p.getClasses() != null ? p.getClasses().getClassName() : null,
                p.getFacility() != null ? p.getFacility().getId() : null,
                p.getFacility() != null ? p.getFacility().getFacilityName() : null,
                p.getExamCampaign() != null ? p.getExamCampaign().getCampaignId() : null,
                p.getExamCampaign() != null ? p.getExamCampaign().getCampaignTitle() : null,
                p.getDob(),
                p.getGender() != null ? p.getGender().name() : null,
                p.getParentPhone(),
                wardId,
                wardName
        );
    }
}