package vn.edu.fpt.eyesora.dto.request;

public record RegisterRequest(
        String username,
        String password,
        String confirmPassword,
        String fullName,
        String facilityId
) {
}