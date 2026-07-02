package vn.edu.fpt.eyesora.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import vn.edu.fpt.eyesora.dto.request.ForgotPasswordRequest;
import vn.edu.fpt.eyesora.dto.request.LoginRequest;
import vn.edu.fpt.eyesora.dto.request.LogoutRequest;
import vn.edu.fpt.eyesora.dto.request.RegisterRequest;
import vn.edu.fpt.eyesora.dto.request.ResetPasswordRequest;
import vn.edu.fpt.eyesora.dto.response.TokenResponse;
import vn.edu.fpt.eyesora.entity.RefreshToken;
import vn.edu.fpt.eyesora.entity.User;
import vn.edu.fpt.eyesora.exceptions.BadRequestException;
import vn.edu.fpt.eyesora.exceptions.ResourceNotFoundException;
import vn.edu.fpt.eyesora.service.IAuthService;
import vn.edu.fpt.eyesora.service.IRefreshTokenService;
import vn.edu.fpt.eyesora.util.JwtUtil;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final IAuthService authService;
    private final AuthenticationManager authManager;
    private final IRefreshTokenService refreshTokenService;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    @Transactional
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password())
        );

        User user = (User) authentication.getPrincipal();
        String id = user.getId();
        String source = "user";
        Set<String> roles = user.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority).collect(Collectors.toSet());

        String accessToken = jwtUtil.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUsername(), source);

        return ResponseEntity.ok(
                new TokenResponse(accessToken, refreshToken.getToken(), id, user.getUsername(), null, roles)
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            authService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body("Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.");
        } catch (BadRequestException | ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyEmail(@RequestParam("token") String token) {
        try {
            authService.verifyEmail(token);
            return ResponseEntity.ok("Xác thực tài khoản thành công. Bạn có thể đăng nhập.");
        } catch (BadRequestException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody LogoutRequest request) {
        try {
            refreshTokenService.deleteByToken(request.refreshToken());
            return ResponseEntity.ok("Đăng xuất thành công");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Đăng xuất thất bại: " + e.getMessage());
        }
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerification(@RequestParam("email") String email) {
        authService.resendVerificationEmail(email);
        return ResponseEntity.ok("Đã gửi lại email xác thực. Vui lòng kiểm tra hộp thư.");
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            authService.processForgotPassword(request.email());
            return ResponseEntity.ok("Đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra email.");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            authService.resetPassword(request);
            return ResponseEntity.ok("Đặt lại mật khẩu thành công. Bạn có thể đăng nhập bằng mật khẩu mới.");
        } catch (BadRequestException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi hệ thống: " + e.getMessage());
        }
    }
}