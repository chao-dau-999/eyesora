package vn.edu.fpt.eyesora.dto.request;

import java.time.LocalDate;

public record PatientRequest(
        String patientName,
        LocalDate dob,
        String gender,
        String parentPhone,
        String campaignId,
        String facilityId
) {}