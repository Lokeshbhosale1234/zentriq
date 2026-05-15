package com.fintech.insights.controller;

import com.fintech.insights.dto.HealthScoreDTO;
import com.fintech.insights.dto.InsightDTO;
import com.fintech.insights.dto.InsightSummaryDTO;
import com.fintech.insights.service.InsightService;
import com.fintech.entity.User;
import com.fintech.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * REST controller for AI financial insights.
 * All endpoints are protected by existing JWT filter via Spring Security.
 * No changes to SecurityConfig needed — these endpoints follow the same
 * authentication pattern as your existing controllers.
 */
@RestController
@RequestMapping("/api/insights")
@CrossOrigin(origins = "*", maxAge = 3600)
public class InsightController {

    private final InsightService  insightService;
    private final UserRepository  userRepository;

    public InsightController(InsightService insightService,
                             UserRepository userRepository) {
        this.insightService = insightService;
        this.userRepository = userRepository;
    }

    /**
     * GET /api/insights
     * Returns a list of all insights for the authenticated user.
     */
    @GetMapping
    public ResponseEntity<List<InsightDTO>> getInsights(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = resolveUser(userDetails);
        return ResponseEntity.ok(insightService.getInsights(user));
    }

    /**
     * GET /api/insights/health-score
     * Returns the financial health score breakdown.
     */
    @GetMapping("/health-score")
    public ResponseEntity<HealthScoreDTO> getHealthScore(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = resolveUser(userDetails);
        return ResponseEntity.ok(insightService.getHealthScore(user));
    }

    /**
     * GET /api/insights/summary
     * Returns the full summary: health score + all insights + smart summary + metrics.
     * This is the primary endpoint consumed by the frontend.
     */
    @GetMapping("/summary")
    public ResponseEntity<InsightSummaryDTO> getSummary(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = resolveUser(userDetails);
        return ResponseEntity.ok(insightService.getSummary(user));
    }

    // ─────────────────────────────────────────────────────────────────
    // Private helper
    // ─────────────────────────────────────────────────────────────────

    /**
     * Resolves the currently authenticated user entity from the JWT principal.
     * Uses the username stored in the JWT token to look up the User entity.
     * This matches the pattern used in your existing controllers.
     */
    private User resolveUser(UserDetails userDetails) {
        return userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Authenticated user not found: "
                        + userDetails.getUsername()));
    }
}
