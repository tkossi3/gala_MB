package com.baobab.gala.controller;

import com.baobab.gala.dto.*;
import com.baobab.gala.service.UpsertResult;
import com.baobab.gala.service.VoteService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

/**
 * API publique : configuration, dépôt d'un vote, consultation de son propre
 * vote, résultats publics (masqués tant que l'organisateur ne les active pas).
 */
@RestController
@RequestMapping("/api")
public class VoteController {

    private static final String COOKIE_NAME = "gala_voter_id";

    private final VoteService voteService;

    @Value("${gala.event-date}")
    private String eventDate;

    public VoteController(VoteService voteService) {
        this.voteService = voteService;
    }

    @GetMapping("/config")
    public ConfigResponse config() {
        return new ConfigResponse(eventDate, voteService.getSettings().isResultsPublic());
    }

    @GetMapping("/my-votes")
    public MyVotesResponse myVotes(
        @CookieValue(name = COOKIE_NAME, required = false) String voterId,
        @RequestParam(required = false) String fingerprint
    ) {
        return new MyVotesResponse(voteService.getMyVotes(voterId, fingerprint));
    }

    @PostMapping("/vote")
    public ResponseEntity<?> vote(
        @Valid @RequestBody VoteRequest body,
        @CookieValue(name = COOKIE_NAME, required = false) String voterId,
        HttpServletRequest request,
        HttpServletResponse response
    ) {
        try {
            UpsertResult result = voteService.upsertVote(
                voterId, body.getCategoryId(), body.getNominee(), body.getFingerprint(), request.getRemoteAddr()
            );

            ResponseCookie cookie = ResponseCookie.from(COOKIE_NAME, result.voterId())
                .httpOnly(true)
                .path("/")
                .maxAge(Duration.ofDays(400))
                .sameSite("Lax")
                .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            return ResponseEntity.ok(new VoteResponse(true, result.isUpdate(), result.voterId()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @GetMapping("/results")
    public ResultsResponse results() {
        return voteService.getPublicResults();
    }
}
