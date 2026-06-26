package vn.edu.fpt.eyesora.dto.response;


import java.time.LocalDate;

public record PatientResponse(
        String patientId,
        String patientName,

        String classId,
        String className,

        String facilityId,
        String facilityName,

        String campaignId,

        LocalDate dob,
        String gender,
        String parentPhone,
        String wardName
) {}
