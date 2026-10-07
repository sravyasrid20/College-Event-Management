package com.collegeevents.controller;

import com.collegeevents.service.GroqService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/groq")
@RequiredArgsConstructor
public class GroqController {

    private final GroqService groqService;

    @PostMapping("/chat")
    public String chat(
            @RequestBody Map<String, String> request,
            Principal principal) {

        String prompt = request.get("prompt");

        if (prompt == null || prompt.trim().isEmpty()) {
            return "Please enter a message.";
        }

        String userEmail = principal != null ? principal.getName() : null;

        return groqService.generateResponse(prompt, userEmail);
    }
}