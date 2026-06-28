package vn.edu.fpt.eyesora.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Tên đăng nhập là bắt buộc")
        @Size(
                min = 4,
                max = 50,
                message = "Tên đăng nhập phải có từ 4 đến 50 ký tự"
        )
        String username,

        @NotBlank(message = "Email là bắt buộc")
        @Email(message = "Email không đúng định dạng")
        String email,

        @NotBlank(message = "Mật khẩu là bắt buộc")
        @Size(
                min = 6,
                message = "Mật khẩu phải có ít nhất 6 ký tự"
        )
        String password,

        @NotBlank(message = "Xác nhận mật khẩu là bắt buộc")
        String confirmPassword,

        @NotBlank(message = "Họ và tên là bắt buộc")
        String fullName,

        @NotBlank(message = "Mã cơ sở là bắt buộc")
        String facilityId
) {}