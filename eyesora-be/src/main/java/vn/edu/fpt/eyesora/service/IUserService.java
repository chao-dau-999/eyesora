package vn.edu.fpt.eyesora.service;

import org.springframework.stereotype.Component;
import vn.edu.fpt.eyesora.dto.request.RegisterRequest;


public interface IUserService {
    void register(RegisterRequest request);
}
