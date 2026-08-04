# =====================================================================
# Gala Baobab — image unique : build du frontend React + backend Spring Boot,
# le tout servi par un seul processus Java sur un seul port.
# =====================================================================

# ---- Étape 1 : build du frontend React ----
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install
COPY frontend/ ./
RUN npm run build
# -> produit /app/frontend/dist (index.html, admin.html, assets/...)

# ---- Étape 2 : build du backend Spring Boot ----
FROM maven:3.9-eclipse-temurin-17 AS backend-build
WORKDIR /app/backend
COPY backend/pom.xml ./
RUN mvn -B dependency:go-offline
COPY backend/src ./src
# Injecte le build React dans les ressources statiques de Spring Boot
COPY --from=frontend-build /app/frontend/dist/ ./src/main/resources/static/
RUN mvn -B clean package -DskipTests

# ---- Étape 3 : image finale, légère ----
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
RUN addgroup -S gala && adduser -S gala -G gala
COPY --from=backend-build /app/backend/target/gala-backend.jar ./gala-backend.jar
# Volume pour la base H2 (persistance des votes entre redémarrages du conteneur)
RUN mkdir -p /app/data && chown -R gala:gala /app
USER gala
EXPOSE 8080
ENV PORT=8080
ENTRYPOINT ["java", "-jar", "gala-backend.jar"]
