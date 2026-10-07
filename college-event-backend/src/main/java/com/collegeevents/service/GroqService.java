package com.collegeevents.service;

import com.collegeevents.dto.ApiResponse;
import com.collegeevents.dto.EventResponse;
import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GroqService {

    private final RestClient restClient;
    private final EventService eventService;
    private final RegistrationService registrationService;

    @Value("${groq.api.key}")
    private String apiKey;

    @Value("${groq.api.url}")
    private String apiUrl;

    @Value("${groq.api.model}")
    private String model;

    public GroqService(
            EventService eventService,
            RegistrationService registrationService) {

        this.restClient = RestClient.create();
        this.eventService = eventService;
        this.registrationService = registrationService;
    }

    public String generateResponse(String prompt, String userEmail) {

        // =========================================================
        // 1. GET APPROVED COLLEGE EVENTS
        // =========================================================

        ApiResponse<List<EventResponse>> eventsResponse =
                eventService.getAllApprovedEvents();

        List<EventResponse> events = eventsResponse.getData();

        StringBuilder eventContext = new StringBuilder();

        if (events != null && !events.isEmpty()) {

            eventContext.append(
                    "Here are the approved events currently available " +
                    "in the college event management system:\n\n"
            );

            for (EventResponse event : events) {

                eventContext.append("Event ID: ")
                        .append(event.getId())
                        .append("\n");

                eventContext.append("Title: ")
                        .append(event.getTitle())
                        .append("\n");

                eventContext.append("Description: ")
                        .append(event.getDescription())
                        .append("\n");

                eventContext.append("Category: ")
                        .append(event.getCategory())
                        .append("\n");

                eventContext.append("Date: ")
                        .append(event.getEventDate())
                        .append("\n");

                eventContext.append("Time: ")
                        .append(event.getEventTime())
                        .append("\n");

                eventContext.append("Venue: ")
                        .append(event.getVenue())
                        .append("\n");

                eventContext.append("Capacity: ")
                        .append(event.getCapacity())
                        .append("\n");

                eventContext.append("Registration Count: ")
                        .append(event.getRegistrationCount())
                        .append("\n");

                eventContext.append("Organizer: ")
                        .append(event.getOrganizerName())
                        .append("\n");

                eventContext.append("Status: ")
                        .append(event.getStatus())
                        .append("\n\n");
            }

        } else {

            eventContext.append(
                    "There are currently no approved events " +
                    "in the college event management system.\n"
            );
        }


        // =========================================================
        // 2. GET CURRENT STUDENT'S REGISTRATIONS
        // =========================================================

        StringBuilder registrationContext = new StringBuilder();

        if (userEmail != null && !userEmail.trim().isEmpty()) {

            try {

                ApiResponse<List<Map<String, Object>>> registrationsResponse =
                        registrationService.getStudentRegistrations(userEmail);

                List<Map<String, Object>> registrations =
                        registrationsResponse.getData();

                if (registrations != null && !registrations.isEmpty()) {

                    registrationContext.append(
                            "The currently logged-in student is registered " +
                            "for the following events:\n\n"
                    );

                    for (Map<String, Object> registration : registrations) {

                        registrationContext.append("Registration ID: ")
                                .append(registration.get("registrationId"))
                                .append("\n");

                        registrationContext.append("Event ID: ")
                                .append(registration.get("eventId"))
                                .append("\n");

                        registrationContext.append("Event Title: ")
                                .append(registration.get("eventTitle"))
                                .append("\n");

                        registrationContext.append("Event Date: ")
                                .append(registration.get("eventDate"))
                                .append("\n");

                        registrationContext.append("Event Time: ")
                                .append(registration.get("eventTime"))
                                .append("\n");

                        registrationContext.append("Venue: ")
                                .append(registration.get("venue"))
                                .append("\n");

                        registrationContext.append("Category: ")
                                .append(registration.get("category"))
                                .append("\n");

                        registrationContext.append("Registered At: ")
                                .append(registration.get("registeredAt"))
                                .append("\n\n");
                    }

                } else {

                    registrationContext.append(
                            "The currently logged-in student is not " +
                            "registered for any events.\n"
                    );
                }

            } catch (Exception exception) {

                registrationContext.append(
                        "The student's registration information " +
                        "is currently unavailable.\n"
                );
            }

        } else {

            registrationContext.append(
                    "No authenticated student information is available.\n"
            );
        }


        // =========================================================
        // 3. BUILD AI PROMPT
        // =========================================================

        String finalPrompt = """
                You are the AI Event Assistant for a College Event Management System.

                Answer the student's question clearly, accurately, and helpfully.

                IMPORTANT RULES:

                1. Use the college event information provided below when the
                   question is about actual college events.

                2. Do not invent event names, dates, venues, organizers,
                   registration counts, or other event details.

                3. If the requested information is not available in the
                   provided event data, clearly say that it is not currently available.

                4. You may provide general suggestions when the student asks
                   for ideas, but clearly distinguish suggestions from actual
                   college events.

                5. Keep answers easy for college students to understand.

                6. Students can register only for APPROVED events.

                7. A student cannot register for the same event more than once.

                8. A student cannot register if the event has reached its capacity.

                9. Students must be logged in with a STUDENT account to
                   register or cancel a registration.

                10. When the student asks about "my registrations",
                    "events I registered for", "my events", or similar
                    questions, use the CURRENT STUDENT REGISTRATION DATA
                    provided below.

                11. Never assume that an event belongs to the current student
                    unless it appears in the CURRENT STUDENT REGISTRATION DATA.

                12. If the current student has no registrations, clearly say
                    that they are not currently registered for any events.

                13. The chatbot should explain the registration process but
                    should not claim that it has registered or cancelled an event.

                14. Actual registration and cancellation must be performed
                    through the College Event Management System.

                15. Do not reveal the student's email address or other
                    authentication information in your response unless the
                    student explicitly asks for it.

                16. Do not claim that the system sends an email, dashboard
                    notification, confirmation message, or any other
                    registration confirmation unless that feature is explicitly
                    available in the system information provided to you.

                17. Only describe features and behavior that are supported by
                    the actual College Event Management System or the
                    information provided in this prompt.

                COLLEGE EVENT DATA:
                %s

                CURRENT STUDENT REGISTRATION DATA:
                %s

                STUDENT QUESTION:
                %s
                """.formatted(
                eventContext,
                registrationContext,
                prompt
        );


        // =========================================================
        // 4. SEND REQUEST TO GROQ
        // =========================================================

        Map<String, Object> message = new HashMap<>();

        message.put("role", "user");
        message.put("content", finalPrompt);

        Map<String, Object> requestBody = new HashMap<>();

        requestBody.put("model", model);
        requestBody.put("messages", List.of(message));


        try {

            JsonNode response = restClient.post()
                    .uri(apiUrl)
                    .contentType(MediaType.APPLICATION_JSON)
                    .header("Authorization", "Bearer " + apiKey)
                    .body(requestBody)
                    .retrieve()
                    .body(JsonNode.class);

            if (response == null) {
                return "No response received from Groq.";
            }

            JsonNode content = response
                    .path("choices")
                    .path(0)
                    .path("message")
                    .path("content");

            if (content.isMissingNode() || content.isNull()) {
                return "Groq returned an unexpected response.";
            }

            return content.asText();

        } catch (Exception exception) {

            return "Groq AI is currently unavailable. Please try again later.";
        }
    }
}