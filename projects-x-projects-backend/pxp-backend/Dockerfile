# ---- build stage ----
FROM maven:3.9.8-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn -q -DskipTests package

# ---- run stage ----
FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar

# Render provides PORT; Spring must bind to it (you already handle this with server.port=${PORT:8080})
ENV PORT=10000
EXPOSE 10000

ENTRYPOINT ["java","-jar","/app/app.jar"]
