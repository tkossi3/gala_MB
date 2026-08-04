# Gala Annuel Maison Baobab — React + Spring Boot

Site événementiel "Chic & Glamour" : vote par catégorie avec anti-doublon,
galerie photo, agenda, thème clair/sombre, espace organisateur avec résultats
en direct et export CSV.

## Architecture

```
gala-fullstack/
  frontend/                  → React (Vite)
    src/
      App.jsx                → site public (hero, à propos, galerie, vote)
      AdminApp.jsx            → espace organisateur
      components/            → composants (Header, Hero, Gallery, VoteSection…)
      data/categories.js      → catégories + nominés + photos (à modifier)
      data/gallery.js          → photos de la galerie + frise chronologique
      api.js                  → appels au backend
      fingerprint.js           → empreinte d'appareil (anti-doublon, filet de sécurité)
    index.html                → page publique
    admin.html                 → page organisateur

  backend/                    → Spring Boot (Java 17)
    src/main/java/com/baobab/gala/
      model/                  → entités JPA (Vote, AppSettings)
      repository/             → accès aux données (Spring Data JPA)
      service/                → logique métier (anti-doublon, résultats, CSV)
      controller/              → API REST (/api/...)
    src/main/resources/
      application.properties
      static/                 → reçoit le build React en production

  Dockerfile                  → image unique (React + Spring Boot)
  docker-compose.yml
```

## Comment le vote fonctionne

- Un **cookie** (`gala_voter_id`, invisible, posé par le backend) identifie
  chaque appareil de façon stable.
- Chaque vote est enregistré par **(appareil, catégorie)** : une contrainte
  d'unicité en base empêche qu'un même appareil ait deux votes dans la même
  catégorie. S'il revote, sa ligne existante est mise à jour — jamais dupliquée.
- Une **empreinte d'appareil** (navigateur, écran, fuseau horaire…) est
  envoyée en filet de sécurité : si le cookie est effacé, le serveur reconnaît
  quand même l'appareil et met à jour son vote au lieu d'en créer un second.
- Les résultats publics (pourcentages visibles sur le site) sont **masqués
  par défaut**. L'organisateur les active depuis `/admin.html` d'un simple
  interrupteur — idéal pour garder le suspense jusqu'à la soirée du Gala,
  tout en gardant l'interface "pourcentages en direct" que vous avez demandée.

**Limite honnête** : comme tout vote en ligne sans compte utilisateur, un
appareil qui changerait à la fois de navigateur, de cookies *et* d'empreinte
pourrait théoriquement revoter. Pour une garantie plus forte (ex. vérification
par code SMS), c'est une étape supplémentaire, distincte de ce livrable.

## Lancer le projet en développement

Deux terminaux :

```bash
# Terminal 1 — backend (port 8080)
cd backend
mvn spring-boot:run

# Terminal 2 — frontend (port 5173, avec rechargement à chaud)
cd frontend
npm install
npm run dev
```

Ouvrez **http://localhost:5173** (site public) et **http://localhost:5173/admin.html** (organisateur).
Vite proxifie automatiquement les appels `/api/...` vers le backend (voir `frontend/vite.config.js`).

Clé admin par défaut en développement : `baobab2026` (définie dans `application.properties`).

## Charger vos photos

1. **Nominés** — éditez `frontend/src/data/categories.js` : chaque nominé a un
   champ `photo`. Remplacez l'URL placeholder par la vôtre, par exemple :
   ```js
   { name: "Alphonse YAKPO", photo: "/photos/alphonse.jpg" }
   ```
   Déposez vos fichiers dans `frontend/public/photos/` (créez le dossier) —
   tout ce qui s'y trouve est servi tel quel par le site.

2. **Galerie** — éditez `frontend/src/data/gallery.js` (tableaux
   `GALLERY_SLIDES` et `TIMELINE_ITEMS`), même principe.

Après modification, relancez `npm run dev` (développement) ou reconstruisez
l'image Docker (production) pour que les changements apparaissent.

## Build de production (sans Docker)

```bash
cd frontend
npm run build                       # génère frontend/dist
cp -r dist/* ../backend/src/main/resources/static/

cd ../backend
mvn clean package -DskipTests       # génère backend/target/gala-backend.jar
java -jar target/gala-backend.jar   # démarre sur http://localhost:8080
```

Le site public et l'espace organisateur sont alors servis sur le **même port** (8080).

## Déploiement

### Option A — Docker (recommandée, la plus simple)

```bash
docker compose up --build -d
```

Le site est disponible sur `http://<adresse-du-serveur>:8080`.
Changez la clé admin dans `docker-compose.yml` (`ADMIN_KEY`) avant de lancer.

Pour l'héberger en ligne : n'importe quelle plateforme qui exécute un
`Dockerfile` fonctionne (Railway, Render, Fly.io, un VPS avec Docker…).

**Railway** (le plus rapide) :
1. Créez un projet, "Deploy from GitHub repo" (poussez `gala-fullstack/` sur GitHub).
2. Railway détecte le `Dockerfile` automatiquement et build l'image.
3. Onglet *Variables* : ajoutez `ADMIN_KEY` (valeur secrète) et `EVENT_DATE`.
4. Onglet *Settings → Networking* : générez un domaine public. C'est prêt.

**Render** :
1. "New → Web Service", connectez votre dépôt GitHub.
2. Environnement : *Docker* (Render lit le `Dockerfile` à la racine).
3. Ajoutez les variables d'environnement `ADMIN_KEY` et `EVENT_DATE`.
4. Render fournit une URL HTTPS automatiquement.

### Option B — VPS classique (Ubuntu) avec Nginx + HTTPS

```bash
# Sur le serveur :
sudo apt update && sudo apt install -y docker.io docker-compose-plugin nginx certbot python3-certbot-nginx
git clone <votre-dépôt> gala && cd gala
docker compose up --build -d
```

Puis configurez Nginx comme reverse proxy vers `127.0.0.1:8080` :

```nginx
server {
    listen 80;
    server_name votre-domaine.tg;
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
sudo certbot --nginx -d votre-domaine.tg   # active HTTPS gratuitement
```

### Option C — Sur place, sans hébergement en ligne

Lancez `docker compose up --build -d` sur un ordinateur connecté au Wi-Fi de
la salle, puis partagez son adresse IP locale (`http://192.168.x.x:8080`) via
un QR code affiché à l'entrée.

## Sécurité avant le jour J

- **Changez `ADMIN_KEY`** (variable d'environnement) — ne gardez jamais la
  valeur par défaut `baobab2026` en production.
- Si le site est servi en HTTPS (fortement recommandé, cf. Certbot ci-dessus),
  pensez à passer le cookie en `secure` : dans
  `VoteController.java`, ajoutez `.secure(true)` à la construction du `ResponseCookie`.
- Désactivez la console H2 en production (`H2_CONSOLE_ENABLED` doit rester à
  `false`, sa valeur par défaut).

## Proclamer les résultats le soir du Gala

1. Ouvrez `/admin.html?key=VOTRE_CLE`.
2. Activez l'interrupteur **"Résultats visibles publiquement"** quand vous
   êtes prêts à révéler les pourcentages en direct sur grand écran.
3. Cliquez sur **"Exporter les votes (CSV pour Excel)"** pour une trace
   complète, catégorie par catégorie, appareil par appareil.

Bon Gala ✦
