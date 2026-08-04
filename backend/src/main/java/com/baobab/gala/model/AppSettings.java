package com.baobab.gala.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

/**
 * Ligne unique (id fixe = 1) contenant les réglages globaux de l'édition en cours.
 * `resultsPublic` permet à l'organisateur de garder le suspense (pourcentages
 * masqués sur le site public) puis de "révéler" les résultats en direct le
 * soir du Gala, sans toucher au code ni redéployer.
 */
@Entity
@Table(name = "app_settings")
public class AppSettings {

    @Id
    private Long id = 1L;

    private boolean resultsPublic = false;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public boolean isResultsPublic() { return resultsPublic; }
    public void setResultsPublic(boolean resultsPublic) { this.resultsPublic = resultsPublic; }
}
