package com.collegeevents.service;

import com.collegeevents.dto.ApiResponse;
import com.collegeevents.model.Event;
import com.collegeevents.model.Registration;
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
public class RegistrationService {

    private final RegistrationRepository registrationRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    public ApiResponse<Map<String, Object>> register(Long eventId, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (event.getStatus() != Event.Status.APPROVED) {
            throw new IllegalArgumentException("Cannot register for an unapproved event");
        }

        if (registrationRepository.existsByStudentAndEvent(student, event)) {
            throw new IllegalArgumentException("Already registered for this event");
        }

        long currentCount = registrationRepository.countByEvent(event);
        if (currentCount >= event.getCapacity()) {
            throw new IllegalArgumentException("Event is full");
        }

        Registration registration = Registration.builder()
                .student(student)
                .event(event)
                .build();

        registrationRepository.save(registration);

        return ApiResponse.success("Registered successfully",
                Map.of("eventId", eventId, "eventTitle", event.getTitle()));
    }

    public ApiResponse<Void> cancelRegistration(Long eventId, String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        Registration registration = registrationRepository.findByStudentAndEvent(student, event)
                .orElseThrow(() -> new RuntimeException("Registration not found"));

        registrationRepository.delete(registration);
        return ApiResponse.success("Registration cancelled successfully");
    }

    public ApiResponse<List<Map<String, Object>>> getStudentRegistrations(String studentEmail) {
        User student = userRepository.findByEmail(studentEmail)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        List<Map<String, Object>> registrations = registrationRepository.findByStudent(student)
                .stream()
                .map(reg -> Map.<String, Object>of(
                        "registrationId", reg.getId(),
                        "eventId", reg.getEvent().getId(),
                        "eventTitle", reg.getEvent().getTitle(),
                        "eventDate", reg.getEvent().getEventDate().toString(),
                        "eventTime", reg.getEvent().getEventTime().toString(),
                        "venue", reg.getEvent().getVenue(),
                        "category", reg.getEvent().getCategory(),
                        "registeredAt", reg.getRegisteredAt().toString()
                ))
                .collect(Collectors.toList());

        return ApiResponse.success("Registrations retrieved", registrations);
    }

    public ApiResponse<List<Map<String, Object>>> getEventAttendees(Long eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        List<Map<String, Object>> attendees = registrationRepository.findByEvent(event)
                .stream()
                .map(reg -> Map.<String, Object>of(
                        "registrationId", reg.getId(),
                        "studentId", reg.getStudent().getId(),
                        "studentName", reg.getStudent().getName(),
                        "studentEmail", reg.getStudent().getEmail(),
                        "registeredAt", reg.getRegisteredAt().toString()
                ))
                .collect(Collectors.toList());

        return ApiResponse.success("Attendees retrieved", attendees);
    }
}
