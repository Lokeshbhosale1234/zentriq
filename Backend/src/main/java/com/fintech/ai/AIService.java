package com.fintech.ai;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Placeholder AI Service - not yet implemented.
 * Future: integrate with OpenAI / Anthropic for financial insights.
 */
@Service
@Slf4j
public class AIService {

    /**
     * Placeholder: analyze transaction patterns and return insights.
     * @param userId the user ID
     * @return insights string (currently empty)
     */
    public String analyzeTransactions(Long userId) {
        log.info("AI analysis not yet implemented for user: {}", userId);
        return "";
    }

    /**
     * Placeholder: generate spending forecast.
     */
    public String generateForecast() {
        log.info("AI forecast not yet implemented");
        return "";
    }
}
