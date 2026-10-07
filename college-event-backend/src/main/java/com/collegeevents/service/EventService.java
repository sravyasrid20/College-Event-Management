package com.collegeevents.service;

import com.collegeevents.dto.ApiResponse;
import com.collegeevents.dto.EventRequest;
import com.collegeevents.dto.EventResponse;
import com.collegeevents.model.Event;
import com.collegeevents.model.User;
import com.collegeevents.repository.EventRepository;
import com.collegeevents.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public ApiResponse<EventResponse> createEvent(EventRequest request, String organizerEmail) {
        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new RuntimeException("Organizer not found"));

        Event event = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .venue(request.getVenue())
                .eventDate(request.getEventDate())
                .eventTime(request.getEventTime())
                .capacity(request.getCapacity())
                .category(request.getCategory())
                .status(Event.Status.PENDING)
                .organizer(organizer)
                .build();

        Event saved = eventRepository.save(event);
        return ApiResponse.success("Event created and pending approval", EventResponse.fromEvent(saved));
    }

    public ApiResponse<EventResponse> updateEvent(Long id, EventRequest request, String organizerEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getOrganizer().getEmail().equals(organizerEmail)) {
            throw new IllegalArgumentException("You can only edit your own events");
        }

        event.setTitle(request.getTitle());
        event.setDescription(request.getDescription());
        event.setVenue(request.getVenue());
        event.setEventDate(request.getEventDate());
        event.setEventTime(request.getEventTime());
        event.setCapacity(request.getCapacity());
        event.setCategory(request.getCategory());
        event.setStatus(Event.Status.PENDING);

        Event saved = eventRepository.save(event);
        return ApiResponse.success("Event updated successfully", EventResponse.fromEvent(saved));
    }

    public ApiResponse<Void> deleteEvent(Long id, String organizerEmail) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));

        if (!event.getOrganizer().getEmail().equals(organizerEmail)) {
            throw new IllegalArgumentException("You can only delete your own events");
        }

        eventRepository.delete(event);
        return ApiResponse.success("Event deleted successfully");
    }

    public ApiResponse<List<EventResponse>> getAllApprovedEvents() {
        List<EventResponse> events = eventRepository.findByStatus(Event.Status.APPROVED)
                .stream()
                .map(EventResponse::fromEvent)
                .collect(Collectors.toList());
        return ApiResponse.success("Events retrieved", events);
    }

    public ApiResponse<List<EventResponse>> getOrganizerEvents(String organizerEmail) {
        User organizer = userRepository.findByEmail(organizerEmail)
                .orElseThrow(() -> new RuntimeException("Organizer not found"));

        List<EventResponse> events = eventRepository.findByOrganizer(organizer)
                .stream()
                .map(EventResponse::fromEvent)
                .collect(Collectors.toList());
        return ApiResponse.success("Events retrieved", events);
    }

    public ApiResponse<List<EventResponse>> getPendingEvents() {
        List<EventResponse> events = eventRepository.findByStatus(Event.Status.PENDING)
                .stream()
                .map(EventResponse::fromEvent)
                .collect(Collectors.toList());
        return ApiResponse.success("Pending events retrieved", events);
    }

    public ApiResponse<EventResponse> approveEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(Event.Status.APPROVED);
        Event saved = eventRepository.save(event);
        return ApiResponse.success("Event approved", EventResponse.fromEvent(saved));
    }

    public ApiResponse<EventResponse> rejectEvent(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        event.setStatus(Event.Status.REJECTED);
        Event saved = eventRepository.save(event);
        return ApiResponse.success("Event rejected", EventResponse.fromEvent(saved));
    }
}
