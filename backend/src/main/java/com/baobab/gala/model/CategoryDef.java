package com.baobab.gala.model;

import java.util.List;

/** Définition statique d'une catégorie : identifiant, titre, nominés autorisés. */
public record CategoryDef(String id, String title, List<String> nominees) {
}
