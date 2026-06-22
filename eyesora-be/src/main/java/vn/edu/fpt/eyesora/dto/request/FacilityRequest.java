package vn.edu.fpt.eyesora.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import vn.edu.fpt.eyesora.entity.Facility;

public record FacilityRequest(
        @NotBlank(message = "Facility name is required")
        @Size(max = 255, message = "Facility name must not exceed 255 characters")
        String facilityName,

        @NotNull(message = "Facility type is required")
        Facility.FacilityType facilityType,

        @Size(max = 500, message = "Address must not exceed 500 characters")
        String address,

        @Pattern(regexp = "^[0-9]{10,11}$", message = "Phone number must be between 10 and 11 digits")
        String phone,

        @NotBlank(message = "District ID is required")
        String districtId,

        @NotBlank(message = "Ward ID is required")
        String wardId
) {}