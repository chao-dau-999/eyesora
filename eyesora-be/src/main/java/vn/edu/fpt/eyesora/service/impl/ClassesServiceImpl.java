package vn.edu.fpt.eyesora.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.fpt.eyesora.dto.request.ClassesRequest;
import vn.edu.fpt.eyesora.dto.response.ClassDetailResponse;
import vn.edu.fpt.eyesora.dto.response.ClassesResponse;
import vn.edu.fpt.eyesora.dto.response.PatientResponse;
import vn.edu.fpt.eyesora.entity.Classes;
import vn.edu.fpt.eyesora.entity.Facility;
import vn.edu.fpt.eyesora.entity.Patient;
import vn.edu.fpt.eyesora.exceptions.ResourceNotFoundException;
import vn.edu.fpt.eyesora.repository.ClassesRepository;
import vn.edu.fpt.eyesora.repository.FacilityRepository;
import vn.edu.fpt.eyesora.service.IClassesService;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ClassesServiceImpl implements IClassesService {
    private final ClassesRepository classesRepository;
    private final FacilityRepository facilityRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<ClassesResponse> getAllClasses(Pageable pageable) {
        return classesRepository.findAll(pageable)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public ClassesResponse getClassById(String id) {
        return classesRepository.findById(id)
                .map(this::mapToResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with ID: " + id));
    }



    @Override
    public ClassesResponse createClass(ClassesRequest req) {
        Facility facility = facilityRepository.findById(req.facilityId())
                .orElseThrow(() -> new ResourceNotFoundException("Facility not found with ID: " + req.facilityId()));

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
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with ID: " + id));

        if (req.facilityId() != null && !req.facilityId().equals(existing.getFacility().getId())) {
            Facility newFacility = facilityRepository.findById(req.facilityId())
                    .orElseThrow(() -> new ResourceNotFoundException("Facility not found with ID: " + req.facilityId()));
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
                c.getFacility() != null ? c.getFacility().getFacilityName() : "N/A",
                c.getClassName(),
                c.getGrade(),
                c.getSchoolYear()
        );
    }

    @Override
    @Transactional(readOnly = true)
    public ClassDetailResponse getClassDetail(String classId, Pageable pageable) {
        Classes cls = classesRepository.findWithPatientsById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found with ID: " + classId));

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
                        p.getDob(),
                        p.getGender() != null ? p.getGender().name() : "N/A",
                        p.getParentPhone(),
                        (p.getWard() != null) ? p.getWard().getWardName() : "Chưa cập nhật"
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
}