package com.baobab.gala.dto;

import jakarta.validation.constraints.NotBlank;

public class VoteRequest {

    @NotBlank
    private String categoryId;

    @NotBlank
    private String nominee;

    private String fingerprint;

    public String getCategoryId() { return categoryId; }
    public void setCategoryId(String categoryId) { this.categoryId = categoryId; }

    public String getNominee() { return nominee; }
    public void setNominee(String nominee) { this.nominee = nominee; }

    public String getFingerprint() { return fingerprint; }
    public void setFingerprint(String fingerprint) { this.fingerprint = fingerprint; }
}
