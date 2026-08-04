package com.baobab.gala.service;

import com.baobab.gala.dto.CategoryTally;
import com.baobab.gala.dto.ResultsResponse;
import com.baobab.gala.model.AppSettings;
import com.baobab.gala.model.CategoryDef;
import com.baobab.gala.model.Vote;
import com.baobab.gala.repository.AppSettingsRepository;
import com.baobab.gala.repository.VoteRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Logique métier du vote :
 * - upsertVote() empêche un appareil de créer deux votes pour une même
 *   catégorie (contrainte d'unicité voterId+categoryId) tout en lui
 *   permettant de revenir modifier son choix (mise à jour de la ligne).
 * - Le fingerprint est un filet de sécurité : si le cookie est absent,
 *   on retrouve l'appareil par son empreinte pour réutiliser son voterId.
 */
@Service
public class VoteService {

    private final VoteRepository voteRepository;
    private final AppSettingsRepository settingsRepository;
    private final CategoryCatalog catalog;

    public VoteService(VoteRepository voteRepository, AppSettingsRepository settingsRepository, CategoryCatalog catalog) {
        this.voteRepository = voteRepository;
        this.settingsRepository = settingsRepository;
        this.catalog = catalog;
    }

    /** Retourne les réglages globaux (créés avec des valeurs par défaut au premier accès). */
    public AppSettings getSettings() {
        return settingsRepository.findById(1L).orElseGet(() -> settingsRepository.save(new AppSettings()));
    }

    public void setResultsPublic(boolean resultsPublic) {
        AppSettings settings = getSettings();
        settings.setResultsPublic(resultsPublic);
        settingsRepository.save(settings);
    }

    /**
     * Enregistre ou met à jour le vote d'un appareil pour une catégorie.
     * @param cookieVoterId identifiant issu du cookie (peut être null au premier vote)
     */
    public UpsertResult upsertVote(String cookieVoterId, String categoryId, String nominee, String fingerprint, String ip) {
        categoryId = categoryId == null ? null : categoryId.strip();
        nominee = nominee == null ? null : nominee.strip();
        fingerprint = fingerprint == null ? null : fingerprint.strip();

        if (!catalog.isValidVote(categoryId, nominee)) {
            throw new IllegalArgumentException("Catégorie ou nominé invalide : " + categoryId + " / " + nominee);
        }

        String voterId = cookieVoterId;
        if (voterId == null && fingerprint != null && !fingerprint.isBlank()) {
            // Cookie absent (effacé ?) : on retrouve l'appareil par son empreinte pour rester sur le même voterId.
            voterId = voteRepository.findByFingerprint(fingerprint).stream()
                .findFirst()
                .map(Vote::getVoterId)
                .orElse(null);
        }
        if (voterId == null) {
            voterId = UUID.randomUUID().toString();
        }

        Optional<Vote> existing = voteRepository.findByVoterIdAndCategoryId(voterId, categoryId);
        Instant now = Instant.now();

        Vote vote = existing.orElseGet(Vote::new);
        boolean isUpdate = existing.isPresent();

        vote.setVoterId(voterId);
        vote.setCategoryId(categoryId);
        vote.setNominee(nominee);
        vote.setFingerprint(fingerprint);
        vote.setUpdatedAt(now);
        vote.setIp(ip);
        if (!isUpdate) vote.setFirstVotedAt(now);

        voteRepository.save(vote);
        return new UpsertResult(voterId, isUpdate);
    }

    /** Votes déjà connus pour cet appareil (pré-remplissage du front). */
    public Map<String, String> getMyVotes(String voterId, String fingerprint) {
        List<Vote> rows = voterId != null ? voteRepository.findByVoterId(voterId) : List.of();
        if (rows.isEmpty() && fingerprint != null && !fingerprint.isBlank()) {
            rows = voteRepository.findByFingerprint(fingerprint);
        }
        return rows.stream().collect(Collectors.toMap(Vote::getCategoryId, Vote::getNominee, (a, b) -> b));
    }

    /** Résultats publics : masqués (tally vide) tant que l'organisateur n'a pas activé la visibilité. */
    public ResultsResponse getPublicResults() {
        boolean isPublic = getSettings().isResultsPublic();
        if (!isPublic) {
            return new ResultsResponse(false, 0, Map.of());
        }
        return computeResults(true);
    }

    /** Résultats complets pour l'organisateur, quel que soit l'état de la bascule publique. */
    public ResultsResponse getAdminResults() {
        boolean isPublic = getSettings().isResultsPublic();
        return computeResults(isPublic);
    }

    private ResultsResponse computeResults(boolean resultsPublicFlag) {
        long totalVoters = voteRepository.findAll().stream().map(Vote::getVoterId).distinct().count();

        Map<String, CategoryTally> tally = new LinkedHashMap<>();
        for (CategoryDef cat : catalog.all()) {
            Map<String, Integer> counts = new LinkedHashMap<>();
            for (String nominee : cat.nominees()) counts.put(nominee, 0);

            List<Vote> rows = voteRepository.findByCategoryId(cat.id());
            for (Vote v : rows) counts.merge(v.getNominee(), 1, Integer::sum);

            String winner = null;
            int winnerCount = -1;
            for (Map.Entry<String, Integer> e : counts.entrySet()) {
                if (e.getValue() > winnerCount) {
                    winnerCount = e.getValue();
                    winner = e.getKey();
                }
            }

            tally.put(cat.id(), new CategoryTally(cat.title(), counts, rows.size(), winner, Math.max(winnerCount, 0)));
        }

        return new ResultsResponse(resultsPublicFlag, totalVoters, tally);
    }

    /** Export CSV brut : une ligne par vote (appareil × catégorie). */
    public String exportCsv() {
        StringBuilder sb = new StringBuilder("\uFEFF"); // BOM pour un bon affichage des accents dans Excel
        sb.append("voter_id,category,nominee,fingerprint,first_voted_at,updated_at\r\n");

        List<Vote> rows = voteRepository.findAll();
        rows.sort(Comparator.comparing(Vote::getVoterId).thenComparing(Vote::getCategoryId));

        for (Vote v : rows) {
            sb.append(csvField(v.getVoterId())).append(',')
              .append(csvField(v.getCategoryId())).append(',')
              .append(csvField(v.getNominee())).append(',')
              .append(csvField(v.getFingerprint())).append(',')
              .append(csvField(String.valueOf(v.getFirstVotedAt()))).append(',')
              .append(csvField(String.valueOf(v.getUpdatedAt())))
              .append("\r\n");
        }
        return sb.toString();
    }

    private String csvField(String value) {
        String safe = value == null ? "" : value.replace("\"", "\"\"");
        return "\"" + safe + "\"";
    }
}
