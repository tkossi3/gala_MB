# =====================================================================
# Gala Baobab — image unique : backend Flask + frontend statique.
# =====================================================================

FROM python:3.12-slim
WORKDIR /app

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/app.py ./backend/app.py
COPY frontend ./frontend

ENV PORT=8080
EXPOSE 8080
ENTRYPOINT ["gunicorn", "--bind", "0.0.0.0:8080", "backend.app:app"]
