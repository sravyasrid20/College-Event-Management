package com.collegeevents.service;

import com.collegeevents.dto.ApiResponse;
import com.collegeevents.model.User;
import com.collegeevents.repository.EventRepository;
import com.collegeevents.repository.RegistrationRepository;
import com.collegeevents.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final EventRepository eventRepository;
    private final RegistrationRepository registrationRepository;

    public ApiResponse<List<Map<String, Object>>> getAllUsers() {
        List<Map<String, Object>> users = userRepository.findAll()
                .stream()
                .map(user -> Map.<String, Object>of(
                        "id", user.getId(),
                        "name", user.getName(),
                        "email", user.getEmail(),
                        "role", user.getRole().name(),
                        "banned", user.isBanned(),
                        "createdAt", user.getCreatedAt() != null ? user.getCreatedAt().toString() : ""
                ))
                .collect(Collectors.toList());
        return ApiResponse.success("Users retrieved", users);
    }

    public ApiResponse<Map<String, Object>> banUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getRole() == User.Role.ADMIN) {
            throw new IllegalArgumentException("Cannot ban an admin user");
        }

        user.setBanned(!user.isBanned());
        userRepository.save(user);

        String msg = user.isBanned() ? "User banned successfully" : "User unbanned successfully";
        return ApiResponse.success(msg, Map.of(
                "id", user.getId(),
                "banned", user.isBanned()
        ));
    }

    public ApiResponse<Map<String, Long>> getDashboard() {
        long totalUsers = userRepository.count();
        long totalEvents = eventRepository.count();
        long totalRegistrations = registrationRepository.count();
        long pendingEvents = eventRepository.findByStatus(
                com.collegeevents.model.Event.Status.PENDING).size();

        Map<String, Long> stats = Map.of(
                "totalUsers", totalUsers,
                "totalEvents", totalEvents,
                "totalRegistrations", totalRegistrations,
                "pendingEvents", pendingEvents
        );
        return ApiResponse.success("Dashboard data retrieved", stats);
    }
}
