# Imagen base ligera con Java
FROM eclipse-temurin:17-jdk-alpine

# Exponemos el puerto interno del contenedor
EXPOSE 808

# El volumen para que guarde datos temporales
VOLUME /tmp

# Copiamos el .jar generado al contenedor
ARG JAR_FILE=target/marMotorBackend-0.0.1-SNAPSHOT.jar
COPY ${JAR_FILE} app.jar

# Comando de ejecución
ENTRYPOINT ["java","-jar","/app.jar"]