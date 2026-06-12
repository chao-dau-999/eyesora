package vn.edu.fpt.eyesora.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.fpt.eyesora.entity.RefreshToken;
import vn.edu.fpt.eyesora.exceptions.RefreshTokenException;
import vn.edu.fpt.eyesora.repository.RefreshTokenRepository;
import vn.edu.fpt.eyesora.service.IRefreshTokenService;


import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements IRefreshTokenService {
    @Value("${JWT_REFRESH_EXPIRES_IN}")
    private long refreshExpirationDays;

    private final RefreshTokenRepository refreshTokenRepository;


    @Override
    public RefreshToken createRefreshToken(String username, String source) {
        refreshTokenRepository.deleteByUsernameAndSource(username, source);

        RefreshToken rt = new RefreshToken();
        rt.setToken(UUID.randomUUID().toString());
        rt.setUsername(username);
        rt.setSource(source);
        rt.setExpiryDate(Instant.now().plus(refreshExpirationDays, ChronoUnit.DAYS));
        rt.setRevoked(false);
        return refreshTokenRepository.save(rt);
    }

    @Override
    @Transactional
    public RefreshToken verifyRefreshToken(String token) {
        RefreshToken rt = refreshTokenRepository.findByToken(token)
                .orElseThrow(() -> new RefreshTokenException("Refresh token not found"));

        if (rt.isRevoked()) {
            throw new RefreshTokenException("Refresh token has been  revoked");
        }
        if (rt.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(rt);
            throw new RefreshTokenException("Refresh token has expired.");
        }
        return rt;
    }

    @Override
    public RefreshToken rotate(RefreshToken old) {
        // Refresh token rotation: xoá cái cũ, tạo cái mới
        refreshTokenRepository.delete(old);
        return createRefreshToken(old.getUsername(), old.getSource());
    }

    @Override
    public void revokeByToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }
}
