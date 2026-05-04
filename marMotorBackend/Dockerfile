# --- ETAPA 1: Construir la aplicación ---
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copiamos todo el contenido del directorio actual (la carpeta marMotorBackend) dentro de /app
COPY . .

# Limpiamos y empaquetamos el proyecto
RUN mvn clean package -DskipTests

# --- ETAPA 2: Ejecutar la aplicación ---
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Copiamos el archivo .jar generado desde la etapa de compilación anterior
COPY --from=build /app/target/marMotorBackend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]