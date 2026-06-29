package vn.edu.fpt.eyesora.dto.request;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record PatientRequest(
        @NotBlank(message = "Tên bệnh nhân là bắt buộc")
        @Size(max = 255, message = "Tên bệnh nhân không được vượt quá 255 ký tự")
        String patientName,

        @NotBlank(message = "Mã lớp là bắt buộc")
        String classId,

        @NotNull(message = "Ngày sinh là bắt buộc")
        @Past(message = "Ngày sinh phải là ngày trong quá khứ")
        LocalDate dob,

        @NotBlank(message = "Giới tính là bắt buộc")
        String gender,

        @Pattern(
                regexp = "^[0-9]{10,11}$",
                message = "Số điện thoại phải có từ 10 đến 11 chữ số"
        )
        String parentPhone,

        @NotBlank(message = "Mã chiến dịch là bắt buộc")
        String campaignId,

        @NotBlank(message = "Mã cơ sở là bắt buộc")
        String facilityId,

        @NotBlank(message = "Mã phường/xã là bắt buộc")
        String wardId
) {}