package com.baobab.gala.controller;

import com.baobab.gala.dto.ErrorResponse;
import com.baobab.gala.dto.ResultsResponse;
import com.baobab.gala.dto.SettingsRequest;
import com.baobab.gala.service.VoteService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Espace organisateur : résultats complets (indépendants de la bascule
 * publique), export CSV, et contrôle de la visibilité publique des résultats.
 * Protégé par une clé simple passée en paramètre `?key=...` — voir le README
 * pour la changer avant l'événement (variable d'environnement ADMIN_KEY).
 */
@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final VoteService voteService;

    @Value("${gala.admin-key}")
    private String adminKey;

    public AdminController(VoteService voteService) {
        this.voteService = voteService;
    }

    private boolean isAuthorized(String key) {
        return adminKey != null && adminKey.equals(key);
    }

    @GetMapping("/results")
    public ResponseEntity<?> results(@RequestParam String key) {
        if (!isAuthorized(key)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Clé administrateur invalide."));
        }
        ResultsResponse results = voteService.getAdminResults();
        return ResponseEntity.ok(results);
    }

    @PostMapping("/settings")
    public ResponseEntity<?> updateSettings(@RequestParam String key, @RequestBody SettingsRequest body) {
        if (!isAuthorized(key)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new ErrorResponse("Clé administrateur invalide."));
        }
        voteService.setResultsPublic(body.isResultsPublic());
        return ResponseEntity.ok(voteService.getAdminResults());
    }

    @GetMapping("/export")
    public ResponseEntity<String> export(@RequestParam String key) {
        if (!isAuthorized(key)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Clé administrateur invalide.");
        }
        String csv = voteService.exportCsv();
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType("text/csv; charset=utf-8"))
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"votes-gala-baobab-2026.csv\"")
            .body(csv);
    }
}
