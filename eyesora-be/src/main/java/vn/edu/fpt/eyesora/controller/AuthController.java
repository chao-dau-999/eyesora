package vn.edu.fpt.eyesora.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import vn.edu.fpt.eyesora.dto.request.LoginRequest;
import vn.edu.fpt.eyesora.dto.request.LogoutRequest;
import vn.edu.fpt.eyesora.dto.request.RegisterRequest;
import vn.edu.fpt.eyesora.dto.response.TokenResponse;
import vn.edu.fpt.eyesora.entity.RefreshToken;
import vn.edu.fpt.eyesora.service.IUserService;
import vn.edu.fpt.eyesora.service.impl.RefreshTokenServiceImpl;
import vn.edu.fpt.eyesora.util.JwtUtil;
import vn.edu.fpt.eyesora.service.impl.UserDetailsService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final IUserService userService;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final UserDetailsService userDetailsService;
    private final RefreshTokenServiceImpl refreshTokenService;


    @PostMapping("/login")
    @Transactional
    public ResponseEntity<?> login(
            @RequestBody LoginRequest loginRequest
    ) {
        Authentication authentication = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.username(),
                        loginRequest.password()));

        UserDetails user = (UserDetails) authentication.getPrincipal();
        String source = "user";
        String accessToken = jwtUtil.generateToken(user);
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getUsername(), source);
        return ResponseEntity.ok(new TokenResponse(accessToken, refreshToken.getToken()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            userService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body("User registered successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }
    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestBody LogoutRequest request) {
        try {

            refreshTokenService.deleteByToken(request.refreshToken());
            return ResponseEntity.ok("Logged out successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Logout failed: " + e.getMessage());
        }
    }

    @GetMapping
    public String hello() {
        return "hello";
    }
}
