package vn.edu.fpt.eyesora.service;

import org.springframework.stereotype.Component;
import vn.edu.fpt.eyesora.dto.request.RegisterRequest;
import vn.edu.fpt.eyesora.dto.request.ResetPasswordRequest;


public interface IUserService {
    void register(RegisterRequest request);
    void verifyEmail(String token);
    void resendVerificationEmail(String email);
    void resetPassword(ResetPasswordRequest request);
    void processForgotPassword(String email);
}
