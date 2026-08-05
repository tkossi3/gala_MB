# Gala Annuel Maison Baobab — Frontend statique + backend Python

Site événementiel "Chic & Glamour" : vote par catégorie avec anti-doublon,
galerie photo, thème clair/sombre, espace organisateur avec résultats
en direct et export CSV.

## Architecture

```
gala-fullstack/
  frontend/                  → HTML / CSS / vanilla JavaScript
    index.html               → page publique
    admin.html               → espace organisateur protégé
    styles.css               → thème sombre/clair, layout responsive
    scripts/main.js          → logique interactive de vote et admin
    data/categories.js       → catalogue de catégories + nominés
    data/gallery.js          → métadonnées de la galerie photo

  backend/                   → Python Flask
    app.py                   → API de vote, anti-doublon, export CSV
    requirements.txt         → dépendances Python
    data/                    → base SQLite persistante

  Dockerfile                 → image Docker Python + frontend statique
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

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
python backend/app.py
```

Ouvrez **http://localhost:8080** pour le site public et
**http://localhost:8080/admin.html?key=baobab2026** pour l'espace organisateur.

Clé admin par défaut en développement : `baobab2026`.

## Charger vos photos

1. **Nominés** — éditez `frontend/data/categories.js` : chaque nominé a un
   champ `photo`. Remplacez l'URL placeholder par la vôtre, par exemple :
   ```js
   { name: "Alphonse YAKPO", photo: "/photos/alphonse.jpg" }
   ```
   Déposez vos fichiers dans `frontend/photos/`.

2. **Galerie** — éditez `frontend/data/gallery.js` (tableau `GALLERY_SLIDES`),
   même principe.

Après modification, redémarrez le backend Python : `python backend/app.py`.

## Build de production (sans Docker)

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
python backend/app.py
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

Note importante : un fichier `.dockerignore` a été ajouté pour éviter d'envoyer
les fichiers volumineux (ex. `.venv`, `docs/`, fichiers locaux) au daemon
Docker — cela réduit fortement le temps et la taille du build.

**Railway** (le plus rapide) :
1. Créez un projet, "Deploy from GitHub repo".
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
  pensez à passer le cookie en `secure` : dans le backend Python, définissez
  `secure=True` sur `response.set_cookie(...)`.

Note technique : le serveur applique maintenant une règle supplémentaire
pour empêcher le même appareil de voter deux fois dans une même catégorie.
Si un second vote est détecté (par `cookie` ou par `fingerprint`), la
requête est rejetée avec un code `409 Conflict` et un message clair.

## Proclamer les résultats le soir du Gala

1. Ouvrez `/admin.html?key=VOTRE_CLE`.
2. Activez l'interrupteur **"Résultats visibles publiquement"** quand vous
   êtes prêts à révéler les pourcentages en direct sur grand écran.
3. Cliquez sur **"Exporter les votes (CSV pour Excel)"** pour une trace
   complète, catégorie par catégorie, appareil par appareil.

Bon Gala ✦
