package com.baobab.gala;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Point d'entrée du backend du Gala Annuel Maison Baobab.
 * Démarre le serveur Web (API de vote + fichiers statiques du frontend React).
 */
@SpringBootApplication
public class GalaApplication {
    public static void main(String[] args) {
        SpringApplication.run(GalaApplication.class, args);
    }
}
