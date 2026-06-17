package vn.edu.fpt.eyesora.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.fpt.eyesora.dto.request.RegisterRequest;
import vn.edu.fpt.eyesora.dto.request.ResetPasswordRequest;
import vn.edu.fpt.eyesora.dto.response.UserResponse;
import vn.edu.fpt.eyesora.entity.PasswordResetToken;
import vn.edu.fpt.eyesora.entity.Role;
import vn.edu.fpt.eyesora.entity.User;
import vn.edu.fpt.eyesora.entity.VerificationToken;
import vn.edu.fpt.eyesora.exceptions.BadRequestException;
import vn.edu.fpt.eyesora.exceptions.ResourceNotFoundException;
import vn.edu.fpt.eyesora.repository.PasswordResetTokenRepository;
import vn.edu.fpt.eyesora.repository.RoleRepository;
import vn.edu.fpt.eyesora.repository.UserRepository;
import vn.edu.fpt.eyesora.repository.VerificationTokenRepository;
import vn.edu.fpt.eyesora.service.IUserService;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final VerificationTokenRepository tokenRepository;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final JavaMailSender mailSender;

    @Override
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new BadRequestException("Username already exists");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email already in use");
        }

        if (!request.password().equals(request.confirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        if (!isValidPassword(request.password())) {
            throw new BadRequestException("Password must be 8-50 characters, including uppercase, lowercase, numbers, and special characters");
        }

        Role defaultRole = roleRepository.findByName("USER")
                .orElseThrow(() -> new ResourceNotFoundException("ROLE_USER configuration missing"));

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword_hash(passwordEncoder.encode(request.password()));
        user.setFull_name(request.fullName());
        user.setFacility_id(request.facilityId());
        user.setStatus(User.AccountStatus.UNVERIFIED);
        user.setRoles(Set.of(defaultRole));

        userRepository.save(user);

        String tokenString = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(tokenString);
        verificationToken.setUser(user);
        verificationToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));

        tokenRepository.save(verificationToken);

        sendVerificationEmail(user.getEmail(), tokenString);

        log.info("Registered user, verification email sent: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void verifyEmail(String token) {
        VerificationToken verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Invalid verification token"));

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Verification token has expired");
        }

        User user = verificationToken.getUser();
        user.setStatus(User.AccountStatus.ACTIVE);
        userRepository.save(user);

        tokenRepository.delete(verificationToken);

        log.info("Account activated successfully: {}", user.getEmail());
    }

    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getStatus() == User.AccountStatus.ACTIVE) {
            throw new BadRequestException("Account already verified.");
        }

        tokenRepository.deleteByUser(user);

        String newToken = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(newToken);
        verificationToken.setUser(user);
        verificationToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));
        tokenRepository.save(verificationToken);

        sendVerificationEmail(user.getEmail(), newToken);
    }



    @Override
    @Transactional
    public void processForgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with this email"));

        passwordResetTokenRepository.deleteByUser(user);

        String tokenString = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(tokenString);
        resetToken.setUser(user);
        resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));

        passwordResetTokenRepository.save(resetToken);

        sendPasswordResetEmail(user.getEmail(), tokenString);
        log.info("Password reset email sent to: {}", user.getEmail());
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new BadRequestException("Passwords do not match");
        }

        if (!isValidPassword(request.newPassword())) {
            throw new BadRequestException("Password must be 8-50 characters, including uppercase, lowercase, numbers, and special characters");
        }

        PasswordResetToken resetToken = passwordResetTokenRepository.findByToken(request.token())
                .orElseThrow(() -> new BadRequestException("Invalid reset token"));

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            passwordResetTokenRepository.delete(resetToken);
            throw new BadRequestException("Reset token has expired");
        }

        User user = resetToken.getUser();
        user.setPassword_hash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        passwordResetTokenRepository.delete(resetToken);

        log.info("Password successfully reset for user: {}", user.getEmail());
    }


    private boolean isValidPassword(String password) {
        String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,50}$";
        return password != null && password.matches(regex);
    }

    private void sendVerificationEmail(String email, String token) {
        try {
            log.info("Attempting to send verification email to: {}", email);

            String link = "http://localhost:8080/api/auth/verify?token=" + token;
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(email);
            msg.setSubject("[Eyesora] Account Verification");
            msg.setText("Hello,\n\n" +
                    "Thank you for registering with Eyesora!\n\n" +
                    "Click the link below to verify your email (expires in 15 minutes):\n" +
                    link + "\n\n" +
                    "If you did not initiate this registration, please ignore this email.\n\n" +
                    "Eyesora Team");

            mailSender.send(msg);
            log.info("Verification email successfully sent to: {}", email);

        } catch (Exception e) {
            log.error("Failed to send verification email to {}. Error: {}", email, e.getMessage());
            e.printStackTrace();
        }
    }

    private void sendPasswordResetEmail(String email, String token) {
        try {
            log.info("Attempting to send password reset email to: {}", email);

            String link = "http://localhost:5173/reset-password?token=" + token;
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo(email);
            msg.setSubject("[Eyesora] Password Reset Request");
            msg.setText("Hello,\n\n" +
                    "You have requested to reset your password.\n\n" +
                    "Click the link below to set a new password (expires in 15 minutes):\n" +
                    link + "\n\n" +
                    "If you did not request a password reset, please ignore this email.\n\n" +
                    "Eyesora Team");

            mailSender.send(msg);
            log.info("Password reset email successfully sent to: {}", email);

        } catch (Exception e) {
            log.error("Failed to send password reset email to {}. Error: {}", email, e.getMessage());
            e.printStackTrace();
        }
    }



    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(u -> new UserResponse(
                        u.getId(),
                        u.getUsername(),
                        u.getEmail(),
                        u.getFull_name(),
                        u.getStatus().name(),
                        u.getRoles().stream().map(Role::getName).collect(java.util.stream.Collectors.toSet())
                ));
    }
    @Override
    public void updateUserStatus(String userId, User.AccountStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setStatus(status);
        userRepository.save(user);
    }
}