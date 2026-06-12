package vn.edu.fpt.eyesora.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.edu.fpt.eyesora.repository.UserRepository;
import vn.edu.fpt.eyesora.service.IUserService;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements IUserService {
    private final UserRepository userRepository;
}
