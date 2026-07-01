package vn.edu.fpt.eyesora.dto.request;

public record ResetPasswordRequest(
        String token,
        String newPassword,
        String confirmPassword
) {}