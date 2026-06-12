package vn.edu.fpt.eyesora.service;

import vn.edu.fpt.eyesora.entity.RefreshToken;

public interface IRefreshTokenService {
    RefreshToken createRefreshToken(String username, String source);
    RefreshToken verifyRefreshToken(String token);
    RefreshToken rotate(RefreshToken old);
    void revokeByToken(String token);
    void deleteByToken(String token);

}
