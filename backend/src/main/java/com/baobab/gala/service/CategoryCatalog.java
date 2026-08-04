package com.baobab.gala.service;

import com.baobab.gala.model.CategoryDef;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * Catalogue des catégories et nominés — doit rester identique à
 * frontend/src/data/categories.js (les noms doivent correspondre exactement,
 * les photos restent uniquement côté frontend).
 * Sert de source de vérité pour valider chaque vote reçu par l'API.
 */
@Component
public class CategoryCatalog {

    private final List<CategoryDef> categories = List.of(
        new CategoryDef("plus-drole", "Le plus drôle",
            List.of("Amorin YAKPO", "Nestor GAHOUZO", "Angelo GLODJO", "Béatrice ANANI")),
        new CategoryDef("plus-sociable", "Le plus sociable",
            List.of("Christophe TAKOUBANA", "Boris DOMATINA", "Grâce GBATI", "Rebecca KPODOUH", "Carlos OLYMPIO", "Rita ")),
        new CategoryDef("meilleur-sapeur", "Le meilleur Sapeur",
            List.of("Britney AGBOSSE", "Blessing GBEGLO", "Doogie AFFONFERE", "Christophe TAKOUBANA", "Aboudou ISSA", "Camelia LOWSON")),
        new CategoryDef("plus-dynamique", "Le plus dynamique",
            List.of("Boris DOMATINA", "Kossivi Tinè KOSSI", "Pamela HEGBE", "Irène ADOKOU", "AGBAGLA", "Rebecca KPODOUH", "Femme Alphonse")),
        new CategoryDef("plus-humble", "Le plus Humble",
            List.of("Bonaventure AFFONFERE", "Ebenezer HOUSSOU", "Jean-Merc DOKITA", "Daniel BOMBOMA", "Bernice ANANI", "Elvis", "Julio"))
    );

    private final Map<String, CategoryDef> byId = categories.stream()
        .collect(java.util.stream.Collectors.toMap(CategoryDef::id, c -> c));

    public List<CategoryDef> all() {
        return categories;
    }

    public Optional<CategoryDef> find(String categoryId) {
        return Optional.ofNullable(byId.get(categoryId));
    }

    public boolean isValidVote(String categoryId, String nominee) {
        CategoryDef cat = byId.get(categoryId);
        return cat != null && nominee != null && cat.nominees().contains(nominee);
    }
}
