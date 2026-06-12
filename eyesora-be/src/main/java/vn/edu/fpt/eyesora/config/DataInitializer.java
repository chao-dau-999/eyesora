package vn.edu.fpt.eyesora.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import vn.edu.fpt.eyesora.entity.Role;
import vn.edu.fpt.eyesora.entity.User;
import vn.edu.fpt.eyesora.repository.RoleRepository;
import vn.edu.fpt.eyesora.repository.UserRepository;
import vn.edu.fpt.eyesora.entity.User.AccountStatus;

import java.util.Set;


@Configuration
@RequiredArgsConstructor
public class DataInitializer {
    private final UserRepository userRepo;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    @Bean
    CommandLineRunner initData() {

        return args -> {

            if (userRepo.count() > 0) {
                return; // tránh insert lại
            }

            Role adminRole = new Role();
            adminRole.setName("ADMIN");

            Role userRole = new Role();
            userRole.setName("USER");

            Role ownerRole = new Role();
            ownerRole.setName("OWNER");

            roleRepository.save(adminRole);
            roleRepository.save(userRole);
            roleRepository.save(ownerRole);

            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword_hash(passwordEncoder.encode("password"));
            admin.setFull_name("System Super Admin");
            admin.setFacility_id(null);
            admin.setRoles(Set.of(adminRole, userRole, ownerRole));
            admin.setStatus(AccountStatus.ACTIVE);

            User owner = new User();
            owner.setUsername("owner1");
            owner.setPassword_hash(passwordEncoder.encode("password"));
            owner.setFull_name("Facility Admin 1");
            owner.setFacility_id(null);
            owner.setRoles(Set.of(ownerRole, userRole));
            owner.setStatus(AccountStatus.ACTIVE);

            userRepo.save(admin);
            userRepo.save(owner);
        };
    }
}
