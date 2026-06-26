package vn.edu.fpt.eyesora.dto.request;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record PatientRequest(
        @NotBlank(message = "Patient name is required")
        @Size(max = 255)
        String patientName,

        @NotBlank(message = "Class ID is required")
        String classId,

        @NotNull(message = "Date of birth is required")
        @Past(message = "Date of birth must be in the past")
        LocalDate dob,

        @NotBlank(message = "Gender is required")
        String gender,

        @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone number must be 10-11 digits")
        String parentPhone,

        @NotBlank(message = "Campaign ID is required")
        String campaignId,

        @NotBlank(message = "Facility ID is required")
        String facilityId
) {}