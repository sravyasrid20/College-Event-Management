package com.collegeevents.controller;

import com.collegeevents.dto.ApiResponse;
import com.collegeevents.dto.EventRequest;
import com.collegeevents.dto.EventResponse;
import com.collegeevents.service.EventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventService eventService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<EventResponse>>> getAllApprovedEvents() {
        return ResponseEntity.ok(eventService.getAllApprovedEvents());
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getMyEvents(Principal principal) {
        return ResponseEntity.ok(eventService.getOrganizerEvents(principal.getName()));
    }

    @GetMapping("/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<EventResponse>>> getPendingEvents() {
        return ResponseEntity.ok(eventService.getPendingEvents());
    }

    @PostMapping
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<ApiResponse<EventResponse>> createEvent(
            @Valid @RequestBody EventRequest request,
            Principal principal) {
        return ResponseEntity.ok(eventService.createEvent(request, principal.getName()));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<ApiResponse<EventResponse>> updateEvent(
            @PathVariable Long id,
            @Valid @RequestBody EventRequest request,
            Principal principal) {
        return ResponseEntity.ok(eventService.updateEvent(id, request, principal.getName()));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ORGANIZER')")
    public ResponseEntity<ApiResponse<Void>> deleteEvent(
            @PathVariable Long id,
            Principal principal) {
        return ResponseEntity.ok(eventService.deleteEvent(id, principal.getName()));
    }

    @PutMapping("/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EventResponse>> approveEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.approveEvent(id));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<EventResponse>> rejectEvent(@PathVariable Long id) {
        return ResponseEntity.ok(eventService.rejectEvent(id));
    }
}
