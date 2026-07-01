package vn.edu.fpt.eyesora.dto.request;

import vn.edu.fpt.eyesora.entity.User;

public record UserStatusRequest(
        User.AccountStatus status
) {}