package vn.edu.fpt.eyesora.service.impl;

import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import vn.edu.fpt.eyesora.dto.request.EyeExamRecordRequest;
import vn.edu.fpt.eyesora.dto.response.EyeExamRecordResponse;
import vn.edu.fpt.eyesora.entity.Classes;
import vn.edu.fpt.eyesora.entity.EyeExamRecord;
import vn.edu.fpt.eyesora.exceptions.ResourceNotFoundException;
import vn.edu.fpt.eyesora.repository.*;
import vn.edu.fpt.eyesora.service.IEyeExamRecordService;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EyeExamRecordServiceImpl implements IEyeExamRecordService {

    private final EyeExamRecordRepository eyeExamRecordRepository;
    private final CampaignRepository campaignRepository;
    private final ClassesRepository classesRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;


    @Override
    @Transactional
    public List<EyeExamRecordResponse> getExamRecords(String campaignId, String classId) {

        Sort sort = Sort.by("examDate").descending();

        Specification<EyeExamRecord> spec = (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.equal(root.get("isDeleted"), false));

            if (campaignId != null && !campaignId.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("campaign").get("campaignId"), campaignId));
            }

            if (classId != null && !classId.isBlank()) {
                predicates.add(criteriaBuilder.equal(root.get("classesField").get("id"), classId));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };

        List<EyeExamRecord> records = eyeExamRecordRepository.findAll(spec, sort);

        return records.stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public EyeExamRecordResponse updateExamRecord(String examId, EyeExamRecordRequest request) {
        EyeExamRecord entity = eyeExamRecordRepository.findById(examId)
                .filter(record -> !Boolean.TRUE.equals(record.getIsDeleted()))
                .orElseThrow(() -> new RuntimeException("Không tìm thấy phiếu kiểm tra thị lực, ID: " + examId));

        if (request.getClassId() != null && !request.getClassId().isBlank()) {
            if (entity.getClassesField() == null || !entity.getClassesField().getId().equals(request.getClassId())) {
                Classes newClasses = classesRepository.findById(request.getClassId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học mới nào có ID: " + request.getClassId()));
                entity.setClassesField(newClasses);
            }
        }

        entity.setVaLeftWithoutGlasses(request.getVaLeftWithoutGlasses());
        entity.setVaLeftWithGlasses(request.getVaLeftWithGlasses());
        entity.setSphLeft(request.getSphLeft() != null ? request.getSphLeft() : 0f);
        entity.setCylLeft(request.getCylLeft() != null ? request.getCylLeft() : 0f);
        entity.setAxisLeft(request.getAxisLeft());

        entity.setVaRightWithoutGlasses(request.getVaRightWithoutGlasses());
        entity.setVaRightWithGlasses(request.getVaRightWithGlasses());
        entity.setSphRight(request.getSphRight() != null ? request.getSphRight() : 0f);
        entity.setCylRight(request.getCylRight() != null ? request.getCylRight() : 0f);
        entity.setAxisRight(request.getAxisRight());

        EyeExamRecord updatedEntity = eyeExamRecordRepository.save(entity);

        return mapToResponse(updatedEntity);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public EyeExamRecordResponse createExamRecord(EyeExamRecordRequest request) {
        EyeExamRecord entity = new EyeExamRecord();

        if (request.getCampaignId() != null && !request.getCampaignId().isBlank()) {
            entity.setCampaign(campaignRepository.getReferenceById(request.getCampaignId()));
        }

        if (request.getPatientId() != null && !request.getPatientId().isBlank()) {
            entity.setPatient(patientRepository.getReferenceById(request.getPatientId()));
        }

        if (request.getClassId() != null && !request.getClassId().isBlank()) {
            entity.setClassesField(classesRepository.getReferenceById(request.getClassId()));
        }

        if (request.getExaminerId() != null && !request.getExaminerId().isBlank()) {
            entity.setExaminer(userRepository.getReferenceById(request.getExaminerId()));
        }

        entity.setIsDeleted(false);

        entity.setVaLeftWithoutGlasses(request.getVaLeftWithoutGlasses());
        entity.setVaLeftWithGlasses(request.getVaLeftWithGlasses());
        entity.setSphLeft(request.getSphLeft() != null ? request.getSphLeft() : 0f);
        entity.setCylLeft(request.getCylLeft() != null ? request.getCylLeft() : 0f);
        entity.setAxisLeft(request.getAxisLeft());

        entity.setVaRightWithoutGlasses(request.getVaRightWithoutGlasses());
        entity.setVaRightWithGlasses(request.getVaRightWithGlasses());
        entity.setSphRight(request.getSphRight() != null ? request.getSphRight() : 0f);
        entity.setCylRight(request.getCylRight() != null ? request.getCylRight() : 0f);
        entity.setAxisRight(request.getAxisRight());

        EyeExamRecord savedEntity = eyeExamRecordRepository.save(entity);

        return mapToResponse(savedEntity);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional(readOnly = true)
    public EyeExamRecordResponse getExamRecordDetail(String examId) {
        EyeExamRecord eyeExamRecord = eyeExamRecordRepository.findById(examId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hồ sơ khám mắt"));

        return mapToResponse(eyeExamRecord);
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void deleteExamRecord(String examId) {
        EyeExamRecord entity = eyeExamRecordRepository.findById(examId)
                .filter(record -> !Boolean.TRUE.equals(record.getIsDeleted()))
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy hoặc đã bị xóa hồ sơ khám mắt với ID: " + examId));

        entity.setIsDeleted(true);
        eyeExamRecordRepository.save(entity);
    }

    private EyeExamRecordResponse mapToResponse(EyeExamRecord entity) {
        return EyeExamRecordResponse.builder()
                .examId(entity.getExamId())
                .examDate(entity.getExamDate())
                .campaignTitle(entity.getCampaign() != null ? entity.getCampaign().getCampaignTitle() : null)
                .patientName(entity.getPatient() != null ? entity.getPatient().getPatientName() : null)
                .className(entity.getClassesField() != null ? entity.getClassesField().getClassName() : null)
                .examinerName(entity.getExaminer() != null ? entity.getExaminer().getFull_name() : null)

                .vaLeftWithoutGlasses(entity.getVaLeftWithoutGlasses())
                .vaLeftWithGlasses(entity.getVaLeftWithGlasses())
                .sphLeft(entity.getSphLeft())
                .cylLeft(entity.getCylLeft())
                .axisLeft(entity.getAxisLeft())

                .vaRightWithoutGlasses(entity.getVaRightWithoutGlasses())
                .vaRightWithGlasses(entity.getVaRightWithGlasses())
                .sphRight(entity.getSphRight())
                .cylRight(entity.getCylRight())
                .axisRight(entity.getAxisRight())
                .build();
    }
}