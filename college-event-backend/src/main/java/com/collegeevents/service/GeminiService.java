package com.collegeevents.service;

import com.google.genai.Client;
import com.google.genai.types.GenerateContentResponse;
import com.google.genai.errors.ClientException;
import com.google.genai.errors.ServerException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class GeminiService {

    private final Client client;

    public GeminiService(
            @Value("${gemini.api.key}") String apiKey) {

        this.client = Client.builder()
                .apiKey(apiKey)
                .build();
    }

    public String generateResponse(String prompt) {

        try {

            GenerateContentResponse response =
                    client.models.generateContent(
                            "gemini-3.8-flash",
                            prompt,
                            null
                    );

            return response.text();

        } catch (ClientException exception) {

            return "Gemini API request was rejected or quota was exceeded.";

        } catch (ServerException exception) {

            return "Gemini API is temporarily unavailable. Please try again later.";
        }
    }
}

