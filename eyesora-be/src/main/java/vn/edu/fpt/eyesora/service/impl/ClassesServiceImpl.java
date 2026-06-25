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
                .map(c -> new ClassesResponse(
                        c.getId(),
                        c.getFacility().getFacilityName(),
                        c.getClassName(),
                        c.getGrade(),
                        c.getSchoolYear()
                ));
    }

    @Override
    public ClassesResponse createClass(ClassesRequest req) {
        Facility facility = facilityRepository.findById(req.facilityId())
                .orElseThrow(() -> new RuntimeException("Facility not found"));

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
                .orElseThrow(() -> new RuntimeException("Class not found"));

        existing.setClassName(req.className());
        existing.setGrade(req.grade());
        existing.setSchoolYear(req.schoolYear());

        return mapToResponse(classesRepository.save(existing));
    }

    private ClassesResponse mapToResponse(Classes c) {
        return new ClassesResponse(c.getId(), c.getFacility().getFacilityName(),
                c.getClassName(), c.getGrade(), c.getSchoolYear());
    }

    public ClassDetailResponse getClassDetail(String classId, Pageable pageable) {
        Classes cls = classesRepository.findWithPatientsById(classId)
                .orElseThrow(() -> new ResourceNotFoundException("Class not found"));

        List<Patient> allPatients = cls.getPatients();


        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), allPatients.size());

        List<PatientResponse> content = (start > allPatients.size())
                ? List.of()
                : allPatients.subList(start, end).stream()
                .map(p -> new PatientResponse(
                        p.getPatientId(),
                        p.getPatientName(),
                        p.getDob(),
                        p.getGender().name(),
                        p.getParentPhone(),
                        (p.getWard() != null) ? p.getWard().getWardName() : "N/A"
                ))
                .toList();

        Page<PatientResponse> patientPage = new PageImpl<>(content, pageable, allPatients.size());

        return new ClassDetailResponse(
                cls.getId(),
                cls.getClassName(),
                cls.getGrade(),
                cls.getPatientCount(),
                patientPage
        );
    }
}