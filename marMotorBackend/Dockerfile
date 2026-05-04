# Usamos una imagen ligera de Java 17 o 21 (la que estés usando)
FROM eclipse-temurin:17-jdk-alpine

# El volumen para que guarde datos temporales
VOLUME /tmp

# Copiamos el .jar generado al contenedor
ARG JAR_FILE=target/marMotorBackend-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

# Comando de ejecución
ENTRYPOINT ["java","-jar","/app.jar"]