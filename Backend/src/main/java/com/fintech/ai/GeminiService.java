package com.fintech.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public String generateFinancialInsights(String prompt) {

        try {

            String url =
                    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key="
                            + apiKey;

            RestTemplate restTemplate = new RestTemplate();

            /*
            |--------------------------------------------------------------------------
            | REQUEST BODY
            |--------------------------------------------------------------------------
            */

            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", prompt);

            Map<String, Object> part = new HashMap<>();
            part.put("parts", new Object[]{textPart});

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("contents", new Object[]{part});

            /*
            |--------------------------------------------------------------------------
            | HEADERS
            |--------------------------------------------------------------------------
            */

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<Map<String, Object>> entity =
                    new HttpEntity<>(requestBody, headers);

            /*
            |--------------------------------------------------------------------------
            | API CALL
            |--------------------------------------------------------------------------
            */

            ResponseEntity<String> response =
                    restTemplate.exchange(
                            url,
                            HttpMethod.POST,
                            entity,
                            String.class
                    );

            /*
            |--------------------------------------------------------------------------
            | PARSE GEMINI RESPONSE
            |--------------------------------------------------------------------------
            */

            JsonNode root = objectMapper.readTree(response.getBody());

            return root
                    .get("candidates")
                    .get(0)
                    .get("content")
                    .get("parts")
                    .get(0)
                    .get("text")
                    .asText();

        } catch (Exception e) {

            return "AI analysis failed: " + e.getMessage();
        }
    }
}
