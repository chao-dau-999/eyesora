package vn.edu.fpt.eyesora.dto.response;

import java.time.LocalDate;

public record PatientResponse(
        String patientId,
        String patientName,
        LocalDate dob,
        String gender,
        String parentPhone,
        String wardName
) {}