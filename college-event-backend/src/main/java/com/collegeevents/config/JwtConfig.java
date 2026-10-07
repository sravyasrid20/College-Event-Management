package com.collegeevents.config;

import com.collegeevents.model.User;
import com.collegeevents.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class JwtConfig {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initAdminUser() {
        return args -> {
            if (!userRepository.existsByEmail("admin@college.com")) {
                User admin = User.builder()
                        .name("System Admin")
                        .email("admin@college.com")
                        .password(passwordEncoder.encode("admin123"))
                        .role(User.Role.ADMIN)
                        .banned(false)
                        .build();
                userRepository.save(admin);
                log.info("Default admin user created: admin@college.com / admin123");
            } else {
                log.info("Admin user already exists, skipping creation.");
            }
        };
    }
}
