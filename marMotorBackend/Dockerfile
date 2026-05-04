# --- ETAPA 1: Construir la aplicación ---
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /workspace/app

# Copiamos la configuración y el código fuente al WORKSPACE
COPY pom.xml .
COPY src ./src

# Compilamos el proyecto de forma explícita
RUN mvn clean package -DskipTests

# --- ETAPA 2: Ejecutar la aplicación ---
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copiamos el .jar generado en la etapa anterior a la carpeta app.jar
COPY --from=build /workspace/app/target/marMotorBackend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]