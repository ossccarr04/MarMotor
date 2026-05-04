# --- ETAPA 1: Compilación ---
FROM maven:3.8.5-openjdk-17 AS build
WORKDIR /app

# Copiamos todo lo que hay en la carpeta marMotorBackend (porque Render ya entró ahí)
COPY . .

# Ejecutamos la compilación
RUN mvn clean package -DskipTests

# --- ETAPA 2: Ejecución ---
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app

# Usamos *.jar para que no importe si el nombre es marmotor o marMotorBackend
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Forzamos el puerto y arrancamos
ENTRYPOINT ["java", "-Dserver.port=${PORT:8080}", "-jar", "app.jar"]