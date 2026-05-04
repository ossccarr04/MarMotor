# --- ETAPA 1: Construir la aplicación con Maven en el servidor ---
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copiamos los archivos de configuración y el código
COPY pom.xml .
COPY src ./src

# Compilamos el proyecto (esto creará el .jar dentro de la carpeta target)
RUN mvn clean package -DskipTests

# --- ETAPA 2: Crear el contenedor final ligero ---
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copiamos el .jar generado en la etapa de compilación
COPY --from=build /app/target/marMotorBackend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]