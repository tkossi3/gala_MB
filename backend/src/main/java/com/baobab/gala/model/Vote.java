package com.baobab.gala.model;

import jakarta.persistence.*;
import java.time.Instant;

/**
 * Un vote = (appareil, catégorie) -> nominé choisi.
 * La contrainte d'unicité sur (voterId, categoryId) garantit qu'un même
 * appareil ne peut jamais avoir deux lignes pour la même catégorie :
 * un revote met à jour la ligne existante au lieu d'en créer une nouvelle.
 */
@Entity
@Table(name = "votes", uniqueConstraints = @UniqueConstraint(columnNames = {"voterId", "categoryId"}))
public class Vote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String voterId;

    @Column(nullable = false)
    private String categoryId;

    @Column(nullable = false)
    private String nominee;

    private String fingerprint;

    @Column(nullable = false)
    private Instant firstVotedAt;

    @Column(nullable = false)
    private Instant updatedAt;

    private String ip;

    public Vote() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getVoterId() { return voterId; }
    public void setVoterId(String voterId) { this.voterId = voterId; }

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getNominee() { return nominee; }
    public void setNominee(String nominee) { this.nominee = nominee; }

    public String getFingerprint() { return fingerprint; }
    public void setFingerprint(String fingerprint) { this.fingerprint = fingerprint; }

    public Instant getFirstVotedAt() { return firstVotedAt; }
    public void setFirstVotedAt(Instant firstVotedAt) { this.firstVotedAt = firstVotedAt; }

    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }

    public String getIp() { return ip; }
    public void setIp(String ip) { this.ip = ip; }
}
