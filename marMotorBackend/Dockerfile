# --- ETAPA 1: Construir la aplicación ---
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /home/app

# Copiamos primero el archivo pom.xml y descargamos las dependencias
COPY pom.xml .
RUN mvn dependency:go-offline

# Ahora copiamos el código fuente
COPY src ./src

# Compilamos el proyecto
RUN mvn clean package -DskipTests

# --- ETAPA 2: Ejecutar la aplicación ---
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copiamos el archivo compilado desde la etapa anterior
COPY --from=build /home/app/target/marMotorBackend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]