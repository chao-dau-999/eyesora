package vn.edu.fpt.eyesora.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.fpt.eyesora.dto.request.ClassesRequest;
import vn.edu.fpt.eyesora.dto.response.ClassDetailResponse;
import vn.edu.fpt.eyesora.dto.response.ClassesResponse;
import vn.edu.fpt.eyesora.dto.response.PatientResponse;
import vn.edu.fpt.eyesora.entity.Classes;
import vn.edu.fpt.eyesora.entity.Facility;
import vn.edu.fpt.eyesora.entity.Patient;
import vn.edu.fpt.eyesora.entity.User;
import vn.edu.fpt.eyesora.exceptions.BusinessException;
import vn.edu.fpt.eyesora.exceptions.ResourceNotFoundException;
import vn.edu.fpt.eyesora.repository.ClassesRepository;
import vn.edu.fpt.eyesora.repository.FacilityRepository;
import vn.edu.fpt.eyesora.service.IClassesService;
import vn.edu.fpt.eyesora.util.SecurityUtil;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Predicate;

@Service
@RequiredArgsConstructor
@Transactional
public class ClassesServiceImpl implements IClassesService {
    private final ClassesRepository classesRepository;
    private final FacilityRepository facilityRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ClassesResponse> getAllClasses(Pageable pageable) {
        User currentUser = SecurityUtil.getCurrentUser();
        if (currentUser == null) {
            throw new AccessDeniedException("User must be authenticated");
        }

        // 1. Kiểm tra role của user hiện tại
        boolean isFacilityAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_FACILITY_ADMIN"));

        boolean isSystemAdmin = currentUser.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

        Specification<Classes> spec = (root, query, criteriaBuilder) -> {
            List<jakarta.persistence.criteria.Predicate> predicates = new ArrayList<>();

            // Giả sử hệ thống của bạn có flag xóa mềm giống như bài trước
            // predicates.add(criteriaBuilder.equal(root.get("isDeleted"), false));

            // 2. Lọc dữ liệu dựa trên Role
            if (isSystemAdmin) {
                // SYSTEM_ADMIN được xem hết sạch, không cần thêm điều kiện filter facility
            } else if (isFacilityAdmin) {
                // FACILITY_ADMIN chỉ được xem các lớp thuộc cơ sở (facility) của mình
                String userFacilityId = currentUser.getFacility().getId();
                predicates.add(criteriaBuilder.equal(
                        root.get("facility").get("id"), userFacilityId
                ));
            } else {
                // Các role khác không có quyền (hoặc bạn có thể cho xem danh sách trống)
                return criteriaBuilder.disjunction(); // Tạo ra điều kiện luôn sai (1=0) để trả về trống
            }

            return criteriaBuilder.and(predicates.toArray((new jakarta.persistence.criteria.Predicate[0])));
        };

        // 3. Thực hiện query với Specification và map sang Response
        return classesRepository.findAll(spec, pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ClassesResponse getClassById(String id) {
        return classesRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp với ID: " + id));
    }



    @Override
    public ClassesResponse createClass(ClassesRequest req) {
        Facility facility = facilityRepository.findById(req.facilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cơ sở với ID: " + req.facilityId()));

        Classes newClass = new Classes();
        newClass.setFacility(facility);
        newClass.setClassName(req.className());
        newClass.setGrade(req.grade());
        newClass.setSchoolYear(req.schoolYear());

        Classes saved = classesRepository.save(newClass);
        return mapToResponse(saved);
    }

    @Override
    public ClassesResponse updateClass(String id, ClassesRequest req) {
        Classes existing = classesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp với ID: " + id));

        if (req.facilityId() != null && !req.facilityId().equals(existing.getFacility().getId())) {
            Facility newFacility = facilityRepository.findById(req.facilityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy cơ sở với ID: " + req.facilityId()));
            existing.setFacility(newFacility);
        }

        existing.setClassName(req.className());
        existing.setGrade(req.grade());
        existing.setSchoolYear(req.schoolYear());

        return mapToResponse(classesRepository.save(existing));
    }

    private ClassesResponse mapToResponse(Classes c) {
        return new ClassesResponse(
                c.getId(),
                c.getFacility() != null ? c.getFacility().getFacilityName() : "Chưa cập nhật",
                c.getClassName(),
                c.getGrade(),
                c.getSchoolYear()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ClassDetailResponse getClassDetail(String classId, Pageable pageable) {
        Classes cls = classesRepository.findWithPatientsById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp với ID: " + classId));

        List<Patient> allPatients = cls.getPatients() != null ? cls.getPatients() : List.of();

        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), allPatients.size());

        List<PatientResponse> content = (start >= allPatients.size())
                ? List.of()
                : allPatients.subList(start, end).stream()
                .map(p -> new PatientResponse(
                        p.getPatientId(),
                        p.getPatientName(),
                        p.getClasses() != null ? p.getClasses().getId() : null,
                        p.getClasses() != null ? p.getClasses().getClassName() : null,
                        p.getFacility() != null ? p.getFacility().getId() : null,
                        p.getFacility() != null ? p.getFacility().getFacilityName() : null,
                        p.getExamCampaign() != null ? p.getExamCampaign().getCampaignId() : null,
                        p.getExamCampaign() != null ? p.getExamCampaign().getCampaignTitle() : null,
                        p.getDob(),
                        p.getGender() != null ? p.getGender().name() : "Chưa cập nhật",
                        p.getParentPhone(),
                        p.getWard() != null ? p.getWard().getId() : null,
                        p.getWard() != null ? p.getWard().getWardName() : "Chưa cập nhật"
                ))
                .toList();

        return new ClassDetailResponse(
                cls.getId(),
                cls.getClassName(),
                cls.getGrade(),
                cls.getPatientCount(),
                new PageImpl<>(content, pageable, allPatients.size())
        );
    }

    @Override
    public void deleteClass(String id) {
        Classes classes = classesRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy lớp với ID: " + id));

        if (classes.getPatients() != null && !classes.getPatients().isEmpty()) {
            throw new BusinessException("Không thể xóa lớp đang có học sinh. Vui lòng chuyển học sinh sang lớp khác trước.");
        }

        classes.setDeleted(true);
        classesRepository.save(classes);
    }
}