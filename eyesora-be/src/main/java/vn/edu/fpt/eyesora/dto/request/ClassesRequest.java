package vn.edu.fpt.eyesora.dto.request;

import jakarta.validation.constraints.*;

public record ClassesRequest(
        @NotBlank(message = "Facility ID is required")
        String facilityId,

        @NotBlank(message = "Class name is required")
        @Size(max = 50, message = "Class name must not exceed 50 characters")
        String className,

        @NotNull(message = "Grade is required")
        @Min(value = 1, message = "Grade must be at least 1")
        @Max(value = 12, message = "Grade must be at most 12")
        Integer grade,

        @NotBlank(message = "School year is required")
        String schoolYear
) {}