package com.collegeevents.controller;

import com.collegeevents.dto.ApiResponse;
import com.collegeevents.service.RegistrationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @PostMapping("/{eventId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Map<String, Object>>> register(
            @PathVariable Long eventId,
            Principal principal) {
        return ResponseEntity.ok(registrationService.register(eventId, principal.getName()));
    }

    @DeleteMapping("/{eventId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<Void>> cancel(
            @PathVariable Long eventId,
            Principal principal) {
        return ResponseEntity.ok(registrationService.cancelRegistration(eventId, principal.getName()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getMyRegistrations(Principal principal) {
        return ResponseEntity.ok(registrationService.getStudentRegistrations(principal.getName()));
    }

    @GetMapping("/event/{eventId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'ORGANIZER')")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> getEventAttendees(
            @PathVariable Long eventId) {
        return ResponseEntity.ok(registrationService.getEventAttendees(eventId));
    }
}
