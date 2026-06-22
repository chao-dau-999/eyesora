package vn.edu.fpt.eyesora.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DistrictRequest(
        @NotBlank(message = "District name is required")
        @Size(max = 100, message = "District name must not exceed 100 characters")
        String districtName
) {}

