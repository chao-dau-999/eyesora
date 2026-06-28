package vn.edu.fpt.eyesora.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record WardRequest(
        @NotBlank(message = "Tên phường/xã là bắt buộc")
        @Size(max = 100, message = "Tên phường/xã không được vượt quá 100 ký tự")
        String wardName,

        @NotBlank(message = "Mã quận/huyện là bắt buộc")
        String districtId
) {}