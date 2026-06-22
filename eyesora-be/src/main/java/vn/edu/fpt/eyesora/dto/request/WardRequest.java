package vn.edu.fpt.eyesora.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record WardRequest(
        @NotBlank(message = "Ward name is required")
        @Size(max = 100, message = "Ward name must not exceed 100 characters")
        String wardName,

        @NotBlank(message = "District ID is required")
        String districtId
) {}