package vn.edu.fpt.eyesora.service.impl;

import jakarta.persistence.criteria.JoinType;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.GrantedAuthority;
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
import vn.edu.fpt.eyesora.util.SecurityUtil;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

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
    public Page<PatientResponse> getPatients(String wardId, String name, Integer birthYear, String classId, String facilityId, Pageable pageable) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new AccessDeniedException("User must be authenticated");
        }

        // 1. Kiểm tra role của user hiện tại
        Set<String> roles = currentUser.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.toSet());

        String finalFacilityId = facilityId;
        boolean hasAccess = false;

        // 2. Quyết định giá trị finalFacilityId dựa trên Role
        if (roles.contains("ROLE_ADMIN") || roles.contains("ROLE_EXAMINER")) {
            // SYSTEM_ADMIN giữ nguyên facilityId truyền từ client (có thể lọc hoặc xem hết nếu null)
            hasAccess = true;
        } else if (roles.contains("ROLE_FACILITY_ADMIN")) {
            // FACILITY_ADMIN bắt buộc chỉ được xem học sinh thuộc cơ sở của mình
            finalFacilityId = currentUser.getFacility().getId();
            hasAccess = true;
        }

        // Thiết lập sort cố định
        Sort hardcodedSort = Sort.by(Sort.Direction.ASC, "classes.className")
                .and(Sort.by(Sort.Direction.ASC, "facility.facilityName"))
                .and(Sort.by(Sort.Direction.ASC, "patientName"));

        Pageable sortedPageable = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), hardcodedSort);

        // Tạo biến hiệu dụng final cho Specification sử dụng
        final String targetFacilityId = finalFacilityId;
        final boolean canViewData = hasAccess;

        Specification<Patient> spec = (root, query, cb) -> {
            // Nếu không thuộc các role được phép truy cập, chặn luôn tại đây
            if (!canViewData) {
                return cb.disjunction(); // Điều kiện luôn sai (1=0) -> trả về trang rỗng
            }

            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            // Tránh lỗi N+1 và lỗi sắp xếp trên thực thể LAZY (chỉ fetch khi không phải câu query COUNT)
            if (Long.class != query.getResultType()) {
                root.fetch("classes", JoinType.LEFT);
                root.fetch("facility", JoinType.LEFT);
            }

            // Luôn lọc các bản ghi chưa xóa
            predicates.add(cb.equal(root.get("isDeleted"), false));

            // Lọc theo Facility (Đã được resolve theo phân quyền ở trên)
            if (targetFacilityId != null && !targetFacilityId.isBlank()) {
                predicates.add(cb.equal(root.get("facility").get("id"), targetFacilityId.trim()));
            }

            // Lọc theo Ward
            if (wardId != null && !wardId.isBlank()) {
                predicates.add(cb.equal(root.get("ward").get("id"), wardId.trim()));
            }

            // Lọc theo Tên học sinh
            if (name != null && !name.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("patientName")), "%" + name.trim().toLowerCase() + "%"));
            }

            // Lọc theo Năm sinh
            if (birthYear != null) {
                predicates.add(cb.between(
                        root.get("dob"),
                        LocalDate.of(birthYear, 1, 1),
                        LocalDate.of(birthYear, 12, 31)
                ));
            }

            // Lọc theo Class
            if (classId != null && !classId.isBlank()) {
                predicates.add(cb.equal(root.get("classes").get("id"), classId.trim()));
            }

            // Xử lý an toàn: nếu không có điều kiện nào thì trả về 1=1 thay vì lỗi mảng trống
            if (predicates.isEmpty()) {
                return cb.conjunction();
            }

            return cb.and(predicates.toArray(new jakarta.persistence.criteria.Predicate[0]));
        };

        return patientRepository.findAll(spec, sortedPageable)
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

        if (!patientClass.getFacility().getId().equals(req.facilityId())) {
            throw new BusinessException("Lớp học bạn chọn không thuộc cơ sở này. Vui lòng kiểm tra lại!");
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

        if (!patientClass.getFacility().getId().equals(req.facilityId())) {
            throw new BusinessException("Lớp học bạn chọn không thuộc cơ sở này. Vui lòng kiểm tra lại!");
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