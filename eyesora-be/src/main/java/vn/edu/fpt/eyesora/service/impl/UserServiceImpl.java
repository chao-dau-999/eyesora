package vn.edu.fpt.eyesora.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.edu.fpt.eyesora.dto.request.ChangePasswordRequest;
import vn.edu.fpt.eyesora.dto.response.UserResponse;
import vn.edu.fpt.eyesora.entity.Role;
import vn.edu.fpt.eyesora.entity.User;
import vn.edu.fpt.eyesora.exceptions.BadRequestException;
import vn.edu.fpt.eyesora.exceptions.ResourceNotFoundException;
import vn.edu.fpt.eyesora.repository.FacilityRepository;
import vn.edu.fpt.eyesora.repository.UserRepository;
import vn.edu.fpt.eyesora.service.IUserService;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements IUserService {

    private final UserRepository userRepository;
    private final FacilityRepository facilityRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Page<UserResponse> getAllUsers(Pageable pageable, String role) {
        if (role != null && !role.trim().isEmpty()) {
            return userRepository.findByRoleName(role, pageable).map(this::mapToUserResponse);
        }
        return userRepository.findAll(pageable).map(this::mapToUserResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserDetail(String id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng với ID: " + id));
        return mapToUserResponse(user);
    }

    @Override
    public void updateUserStatus(String userId, User.AccountStatus status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));
        user.setStatus(status);
        userRepository.save(user);
    }

    @Override
    @Transactional(readOnly = true)
    public User findByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));
    }

    @Override
    @Transactional
    public void changePassword(String userId, ChangePasswordRequest request) {
        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Mật khẩu mới và xác nhận mật khẩu không khớp.");
        }

        if (!isValidPassword(request.getNewPassword())) {
            throw new BadRequestException("Mật khẩu phải từ 8-50 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng."));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword_hash())) {
            throw new BadRequestException("Mật khẩu cũ không chính xác.");
        }

        user.setPassword_hash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Người dùng {} đã thay đổi mật khẩu thành công.", user.getEmail());
    }

    private boolean isValidPassword(String password) {
        String regex = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,50}$";
        return password != null && password.matches(regex);
    }

    private UserResponse mapToUserResponse(User user) {
        String facilityName = "N/A";
        if (user.getFacility_id() != null) {
            facilityName = facilityRepository.findById(user.getFacility_id())
                    .map(facility -> facility.getFacilityName())
                    .orElse("Không xác định");
        }

        return new UserResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFull_name(),
                user.getStatus().name(),
                user.getRoles().stream().map(Role::getName).collect(Collectors.toSet()),
                facilityName
        );
    }
}