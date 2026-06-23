package vn.edu.fpt.eyesora.dto.response;

import org.springframework.data.domain.Page;


public record ClassDetailResponse(
        String id,
        String className,
        Integer grade,
        Long patientCount,
        Page<PatientResponse> patients
) {}
