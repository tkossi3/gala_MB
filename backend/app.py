import os
import sqlite3
import uuid
from datetime import datetime, timedelta
from flask import Flask, abort, g, jsonify, make_response, request, send_from_directory
from flask_cors import CORS

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")
DB_PATH = os.path.join(DATA_DIR, "votes.db")
FRONTEND_DIR = os.path.abspath(os.path.join(BASE_DIR, "..", "frontend"))
COOKIE_NAME = "gala_voter_id"
EVENT_DATE = os.getenv("EVENT_DATE", "2026-08-08T18:00:00")
ADMIN_KEY = os.getenv("ADMIN_KEY", "baobab2026")

app = Flask(__name__, static_folder=None)
CORS(
    app,
    resources={r"/api/*": {"origins": [
        "https://gala-mb.vercel.app",
        "https://www.gala-mb.vercel.app",
        "http://localhost:8080",
        "http://127.0.0.1:8080"
    ]}},
    supports_credentials=True,
    allow_headers=["Content-Type"],
    methods=["GET", "POST", "OPTIONS"]
)

CATEGORIES = [
    {
        "id": "plus-drole",
        "title": "Le(la) plus drôle",
        "nominees": [
            "Alphonse HAGNABOE",
            "Nestor GAHOUZO",
            "Angelo GLODJO",
            "Beatrice AMETODJI"
        ]
    },
    {
        "id": "plus-sociable",
        "title": "Le(la) plus sociable",
        "nominees": [
            "Boris GNANSA",
            "Irène ADOKOU",
            "Rebecca KPODOUH",
            "Rita ALOU"
        ]
    },
    {
        "id": "meilleur-sapeur",
        "title": "Le(la) meilleur Sapeur",
        "nominees": [
            "Britney AGBOSSE",
            "Blessing GBEGLO",
            "Doogie Bonaventure AFFONFERE",
            "Christophe TAKOUBANA"
        ]
    },
    {
        "id": "plus-dynamique",
        "title": "Le plus dynamique",
        "nominees": [
            "Pamela HEGBE",
            "Kossivi Tinè KOSSI",
            "Madelaine DOUTI",
            "Déborah AGBAGLA"
        ]
    },
    {
        "id": "plus-humble",
        "title": "Le(la) plus Humble",
        "nominees": [
            "Julio ATTIDEKA",
            "Jean-Marc DOKITA",
            "Daniel BOMBOMA",
            "Bernice ANANI",
            "Ebenezer HOUSSOU"
        ]
    }
]


def get_db():
    if "db" not in g:
        os.makedirs(DATA_DIR, exist_ok=True)
        conn = sqlite3.connect(DB_PATH, detect_types=sqlite3.PARSE_DECLTYPES)
        conn.row_factory = sqlite3.Row
        g.db = conn
        create_tables(conn)
    return g.db


def create_tables(conn):
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS votes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            voter_id TEXT NOT NULL,
            category_id TEXT NOT NULL,
            nominee TEXT NOT NULL,
            fingerprint TEXT,
            first_voted_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            ip TEXT,
            UNIQUE(voter_id, category_id, nominee)
        )
        """
    )
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY,
            results_public INTEGER NOT NULL DEFAULT 0
        )
        """
    )
    conn.execute("INSERT OR IGNORE INTO settings (id, results_public) VALUES (1, 0)")
    # Ensure an index to prevent the same fingerprint from voting multiple
    # times for the same category. NULL fingerprints are allowed.
    conn.execute(
        "CREATE UNIQUE INDEX IF NOT EXISTS ux_votes_fingerprint_category ON votes(fingerprint, category_id, nominee)"
    )
    conn.commit()


@app.teardown_appcontext

def close_db(exception):
    db = g.pop("db", None)
    if db is not None:
        db.close()


def normalize_text(value):
    if value is None:
        return None
    return str(value).strip()


def find_category(category_id):
    if category_id is None:
        return None
    category_id = normalize_text(category_id)
    for category in CATEGORIES:
        if category["id"] == category_id:
            return category
    return None


def valid_nominee(category, nominee):
    nominee = normalize_text(nominee)
    if nominee is None:
        return False
    return any(normalize_text(name) == nominee for name in category["nominees"])


def is_valid_vote(category_id, nominee):
    category = find_category(category_id)
    return category is not None and valid_nominee(category, nominee)


def get_settings():
    db = get_db()
    row = db.execute("SELECT results_public FROM settings WHERE id = 1").fetchone()
    return bool(row["results_public"]) if row else False


def set_results_public(value):
    db = get_db()
    db.execute("UPDATE settings SET results_public = ? WHERE id = 1", (1 if value else 0,))
    db.commit()


def get_voter_id(cookie_voter_id, fingerprint):
    db = get_db()
    voter_id = normalize_text(cookie_voter_id)
    if voter_id:
        return voter_id

    fingerprint = normalize_text(fingerprint)
    if fingerprint:
        row = db.execute(
            "SELECT voter_id FROM votes WHERE fingerprint = ? LIMIT 1",
            (fingerprint,)
        ).fetchone()
        if row:
            return row["voter_id"]

    return str(uuid.uuid4())


def map_votes(rows):
    votes = {}
    for row in rows:
        votes.setdefault(row["category_id"], []).append(row["nominee"])
    return votes


def compute_results(include_counts):
    db = get_db()
    rows = db.execute("SELECT voter_id, category_id, nominee FROM votes").fetchall()
    category_totals = {cat["id"]: {nominee: 0 for nominee in cat["nominees"]} for cat in CATEGORIES}

    voter_ids = set()
    for row in rows:
        voter_ids.add(row["voter_id"])
        category_totals[row["category_id"]][row["nominee"]] += 1

    tally = {}
    for cat in CATEGORIES:
        counts = category_totals[cat["id"]]
        total_votes = sum(counts.values())
        winner = None
        winner_count = -1
        for nominee, count in counts.items():
            if count > winner_count:
                winner_count = count
                winner = nominee
        tally[cat["id"]] = {
            "title": cat["title"],
            "counts": counts,
            "totalVotes": total_votes,
            "winner": winner,
            "winnerCount": max(winner_count, 0)
        }

    return {"resultsPublic": bool(include_counts), "totalVoters": len(voter_ids), "tally": tally if include_counts else {}}


@app.route("/api/config")
def config():
    return jsonify({"eventDate": EVENT_DATE, "resultsPublic": get_settings()})


@app.route("/api/my-votes")
def my_votes():
    voter_id = request.cookies.get(COOKIE_NAME)
    fingerprint = normalize_text(request.args.get("fingerprint"))
    db = get_db()
    if voter_id:
        rows = db.execute("SELECT category_id, nominee FROM votes WHERE voter_id = ?", (voter_id,)).fetchall()
    elif fingerprint:
        rows = db.execute("SELECT category_id, nominee FROM votes WHERE fingerprint = ?", (fingerprint,)).fetchall()
    else:
        rows = []
    return jsonify({"votes": map_votes(rows)})


@app.route("/api/vote", methods=["POST"])
def vote():
    body = request.get_json(silent=True)
    if not body:
        return jsonify({"error": "Corps de requête JSON invalide."}), 400

    category_id = normalize_text(body.get("categoryId"))
    nominee = normalize_text(body.get("nominee"))
    fingerprint = normalize_text(body.get("fingerprint"))

    if not is_valid_vote(category_id, nominee):
        return jsonify({"error": f"Catégorie ou nominé invalide : {category_id} / {nominee}"}), 400

    voter_id = get_voter_id(request.cookies.get(COOKIE_NAME), fingerprint)
    now = datetime.utcnow().isoformat()
    db = get_db()

    # Récupérer les votes actuels dans cette catégorie
    current_votes = db.execute(
        "SELECT id, nominee FROM votes WHERE voter_id = ? AND category_id = ?",
        (voter_id, category_id)
    ).fetchall()
    
    current_nominees = [r["nominee"] for r in current_votes]

    # 1. Bloquer si déjà voté pour ce candidat spécifique
    if nominee in current_nominees:
        return jsonify({"error": "Vous avez déjà voté pour ce candidat."}), 400

    # 2. Bloquer si la limite de 2 votes est atteinte
    if len(current_nominees) >= 2:
        return jsonify({"error": "Vous avez déjà utilisé vos 2 votes dans cette catégorie."}), 400

    # 3. Enregistrer le vote
    try:
        db.execute(
            "INSERT INTO votes (voter_id, category_id, nominee, fingerprint, first_voted_at, updated_at, ip) VALUES (?, ?, ?, ?, ?, ?, ?)",
            (voter_id, category_id, nominee, fingerprint, now, now, request.remote_addr)
        )
        db.commit()
    except sqlite3.IntegrityError:
        return jsonify({"error": "Cet appareil a déjà voté pour ce candidat."}), 409

    response = make_response(jsonify({"success": True, "voterId": voter_id}))
    max_age = 400 * 24 * 60 * 60
    secure_cookie = request.headers.get("X-Forwarded-Proto", "http") == "https" or request.is_secure
    response.set_cookie(
        COOKIE_NAME,
        voter_id,
        max_age=max_age,
        httponly=True,
        samesite="None",
        secure=secure_cookie,
        path="/"
    )
    return response


def authorize_admin():
    key = request.args.get("key")
    if not key or key != ADMIN_KEY:
        abort(401, description="Clé administrateur invalide.")


@app.route("/api/admin/results")
def admin_results():
    authorize_admin()
    admin_response = compute_results(True)
    admin_response["resultsPublic"] = get_settings()
    return jsonify(admin_response)


@app.route("/api/admin/settings", methods=["POST"])
def admin_settings():
    authorize_admin()
    body = request.get_json(silent=True)
    if not body or "resultsPublic" not in body:
        return jsonify({"error": "Payload invalide."}), 400
    set_results_public(bool(body["resultsPublic"]))
    admin_response = compute_results(True)
    admin_response["resultsPublic"] = get_settings()
    return jsonify(admin_response)


@app.route("/api/admin/export")
def admin_export():
    authorize_admin()
    db = get_db()
    rows = db.execute(
        "SELECT voter_id, category_id, nominee, fingerprint, first_voted_at, updated_at FROM votes ORDER BY voter_id, category_id"
    ).fetchall()

    lines = ["\ufeffvoter_id,category,nominee,fingerprint,first_voted_at,updated_at"]
    for row in rows:
        values = [row["voter_id"], row["category_id"], row["nominee"], row["fingerprint"] or "", row["first_voted_at"], row["updated_at"]]
        quoted = [f'"{str(value).replace("\"", "\"\"")}"' for value in values]
        lines.append(",".join(quoted))

    response = make_response("\r\n".join(lines))
    response.headers["Content-Type"] = "text/csv; charset=utf-8"
    response.headers["Content-Disposition"] = "attachment; filename=votes-gala-baobab-2026.csv"
    return response


@app.route("/api/results")
def public_results():
    public = get_settings()
    payload = compute_results(public)
    payload["resultsPublic"] = public
    return jsonify(payload)


@app.route("/", defaults={"path": "index.html"})
@app.route("/<path:path>")
def serve_static(path):
    target = os.path.join(FRONTEND_DIR, path)
    if os.path.isfile(target):
        return send_from_directory(FRONTEND_DIR, path)
    return send_from_directory(FRONTEND_DIR, "index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 8080)))
    #app.run(host='0.0.0.0', port=5000, debug=True)
