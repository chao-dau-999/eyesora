package vn.edu.fpt.eyesora.config;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import vn.edu.fpt.eyesora.entity.ExamCampaign;
import vn.edu.fpt.eyesora.entity.Facility;
import vn.edu.fpt.eyesora.entity.Role;
import vn.edu.fpt.eyesora.entity.User;
import vn.edu.fpt.eyesora.repository.CampaignRepository;
import vn.edu.fpt.eyesora.repository.FacilityRepository;
import vn.edu.fpt.eyesora.repository.RoleRepository;
import vn.edu.fpt.eyesora.repository.UserRepository;
import vn.edu.fpt.eyesora.entity.User.AccountStatus;

import java.time.LocalDate;
import java.util.Set;


@Configuration
@RequiredArgsConstructor
public class DataInitializer {
    private final UserRepository userRepo;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final FacilityRepository facilityRepository;

    @Bean
    CommandLineRunner initData(CampaignRepository campaignRepository) {

        return args -> {

//            if (facilityRepository.count() == 0) {
//                Facility facility = new Facility();
//                facility.setFacilityName("THCS Le Hồng Phong");
//                facility.setFacilityType(Facility.FacilityType.SCHOOL);
//
//                facilityRepository.save(facility);
//
//                Facility facility1 = new Facility();
//                facility1.setFacilityName("THCS Dương Kỳ Hiệp");
//                facility1.setFacilityType(Facility.FacilityType.SCHOOL);
//                facilityRepository.save(facility1);
//
//            }
//
//            if (campaignRepository.count() == 0) {
//                ExamCampaign examCampaign = new ExamCampaign();
//                examCampaign.setCampaignTitle("THCS Duong Ki Hiep - 13/04/2026");
//                examCampaign.setStartDate(LocalDate.of(2026, 4, 13));
//                examCampaign.setEndDate(LocalDate.of(2026, 4, 13));
//                campaignRepository.save(examCampaign);
//            }
//
//            if (!(userRepo.count() > 0)) {
//                Role adminRole = new Role();
//                adminRole.setName("ADMIN");
//
//                Role examinerRole = new Role();
//                examinerRole.setName("EXAMINER");
//
//                Role facilityOwner = new Role();
//                facilityOwner.setName("FACILITY_ADMIN");
//
//                roleRepository.save(adminRole);
//                roleRepository.save(examinerRole);
//                roleRepository.save(facilityOwner);
//
//                User admin = new User();
//                admin.setUsername("admin");
//                admin.setPassword_hash(passwordEncoder.encode("password"));
//                admin.setFull_name("System Super Admin");
//                admin.setEmail("admin12345@gmail.com");
//                admin.setFacility(null);
//                admin.setRoles(Set.of(adminRole));
//                admin.setStatus(AccountStatus.ACTIVE);
//
//                User owner = new User();
//                owner.setUsername("owner1");
//                owner.setPassword_hash(passwordEncoder.encode("password"));
//                owner.setFull_name("Facility 1");
//                owner.setEmail("owner1@gmail.com");
//                owner.setFacility(facilityRepository.findAll().get(0));
//                owner.setRoles(Set.of(facilityOwner));
//                owner.setStatus(AccountStatus.ACTIVE);
//
//                User examiner = new User();
//                examiner.setUsername("examiner");
//                examiner.setPassword_hash(passwordEncoder.encode("password"));
//                examiner.setFull_name("Examiner 1");
//                examiner.setEmail("examiner@gmail.com");
//                examiner.setFacility(null);
//                examiner.setRoles(Set.of(examinerRole));
//                examiner.setStatus(AccountStatus.ACTIVE);
//
//                userRepo.save(admin);
//                userRepo.save(owner);
//                userRepo.save(examiner);
//            }




        };
    }
}
