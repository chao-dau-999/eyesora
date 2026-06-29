package vn.edu.fpt.eyesora.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record DistrictRequest(
        @NotBlank(message = "Tên quận/huyện là bắt buộc")
        @Size(max = 100, message = "Tên quận/huyện không được vượt quá 100 ký tự")
        String districtName
) {}