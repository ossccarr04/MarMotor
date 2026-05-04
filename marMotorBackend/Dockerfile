# --- ETAPA 1: Construir la aplicación ---
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /home/app

# Copiamos todo el contenido del directorio actual (marMotorBackend) al contenedor
COPY . .

# Compilamos el proyecto
RUN mvn clean package -DskipTests

# --- ETAPA 2: Ejecutar la aplicación ---
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copiamos el archivo compilado desde la etapa anterior
COPY --from=build /home/app/target/marMotorBackend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]