package vn.edu.fpt.eyesora.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;
import vn.edu.fpt.eyesora.dto.request.RegisterRequest;
import vn.edu.fpt.eyesora.dto.request.ResetPasswordRequest;
import vn.edu.fpt.eyesora.dto.response.UserResponse;
import vn.edu.fpt.eyesora.entity.User;


public interface IUserService {
    void register(RegisterRequest request);
    void verifyEmail(String token);
    void resendVerificationEmail(String email);
    void resetPassword(ResetPasswordRequest request);
    void processForgotPassword(String email);
    Page<UserResponse> getAllUsers(Pageable pageable);
    void updateUserStatus(String userId, User.AccountStatus status);
    UserResponse getUserDetail(String id);
}
