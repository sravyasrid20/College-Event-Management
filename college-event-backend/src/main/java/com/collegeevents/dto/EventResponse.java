package com.collegeevents.dto;

import com.collegeevents.model.Event;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventResponse {
    private Long id;
    private String title;
    private String description;
    private String venue;
    private LocalDate eventDate;
    private LocalTime eventTime;
    private Integer capacity;
    private String category;
    private Event.Status status;
    private Long organizerId;
    private String organizerName;
    private LocalDateTime createdAt;
    private int registrationCount;

    public static EventResponse fromEvent(Event event) {
        return EventResponse.builder()
                .id(event.getId())
                .title(event.getTitle())
                .description(event.getDescription())
                .venue(event.getVenue())
                .eventDate(event.getEventDate())
                .eventTime(event.getEventTime())
                .capacity(event.getCapacity())
                .category(event.getCategory())
                .status(event.getStatus())
                .organizerId(event.getOrganizer().getId())
                .organizerName(event.getOrganizer().getName())
                .createdAt(event.getCreatedAt())
                .registrationCount(event.getRegistrations() != null ? event.getRegistrations().size() : 0)
                .build();
    }
}
