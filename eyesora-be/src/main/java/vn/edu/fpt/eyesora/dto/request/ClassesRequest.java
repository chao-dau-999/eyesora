package vn.edu.fpt.eyesora.dto.request;

import jakarta.validation.constraints.*;

public record ClassesRequest(
        @NotBlank(message = "Mã cơ sở là bắt buộc")
        String facilityId,

        @NotBlank(message = "Tên lớp là bắt buộc")
        @Size(max = 50, message = "Tên lớp không được vượt quá 50 ký tự")
        String className,

        @NotNull(message = "Khối lớp là bắt buộc")
        @Min(value = 1, message = "Khối lớp phải lớn hơn hoặc bằng 1")
        @Max(value = 12, message = "Khối lớp phải nhỏ hơn hoặc bằng 12")
        Integer grade,

        @NotBlank(message = "Năm học là bắt buộc")
        String schoolYear
) {}