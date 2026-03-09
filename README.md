# 🚗 Catálogo de Coches - Web App

Una aplicación web de pila completa (Full-Stack) diseñada para explorar, buscar y visualizar detalles de vehículos en un catálogo interactivo. 

## 📋 Características Principales
* **Catálogo interactivo:** Visualización en cuadrícula/lista de los vehículos disponibles.
* **Búsqueda y Filtros Avanzados:** Búsqueda personalizada por marca, modelo, año, etc.
* **Vista de Detalles:** Información exhaustiva de cada vehículo al hacer clic sobre él.
* **Arquitectura Segura:** Implementación de medidas de seguridad en frontend y backend.

## 🛠️ Tecnologías Utilizadas

* **Frontend:** Angular, TypeScript, HTML/SCSS.
* **Backend:** Java, Spring Boot, Spring Data JPA, Hibernate.
* **Base de Datos:** MySQL.
* **Despliegue (Producción):** Vercel (Frontend), Render (Backend), Koyeb (Base de datos).

## 🔒 Arquitectura de Seguridad

La aplicación implementa múltiples capas de seguridad para proteger los datos y la infraestructura:

### Seguridad en el Backend (Spring Boot)
1. **Variables de Entorno:** Las credenciales de la base de datos (MySQL) nunca se exponen en el código fuente. Se inyectan a través de variables de entorno (`application.properties`).
2. **CORS Restringido:** El servidor solo acepta peticiones HTTP provenientes del dominio oficial del frontend, bloqueando accesos no autorizados a la API.
3. **Prevención de SQL Injection:** Uso de Spring Data JPA e Hibernate, que utilizan *Prepared Statements* de forma nativa para evitar inyecciones SQL en las búsquedas.
4. **HTTPS en Tránsito:** Toda comunicación en producción se realiza a través de túneles encriptados (SSL/TLS).

### Seguridad en el Frontend (Angular)
1. **Sanitización de Datos:** Angular protege la aplicación por defecto contra ataques XSS (Cross-Site Scripting) limpiando los valores antes de insertarlos en el DOM.
2. **Variables de Entorno (Environments):** Separación de URLs de desarrollo (`localhost`) y producción para evitar apuntar accidentalmente a la base de datos real durante pruebas locales.

---

## ⚙️ Requisitos Previos

Para ejecutar este proyecto en tu entorno local, asegúrate de tener instalado:
* **Java:** JDK 17 o superior.
* **Node.js:** Versión 18.x o superior.
* **Angular CLI:** Versión 16+.
* **MySQL:** Servidor local activo (o conexión a tu base de datos en Koyeb).
* **Maven:** Para la gestión de dependencias del backend.

---

## 🚀 Instalación y Ejecución Local



Sigue estos pasos para levantar la aplicación en tu máquina local:

### 1. Configuración de la Base de Datos (MySQL)
1. Inicia tu servidor MySQL.
2. Crea una base de datos local (ej. `coches_db`).
3. Actualiza el archivo `src/main/resources/application.properties` en el backend con tus credenciales locales o configura las variables de entorno locales (`DB_URL`, `DB_USER`, `DB_PASSWORD`).

### 2. Levantar el Backend (Spring Boot)
Abre una terminal en la carpeta del backend y ejecuta:
```bash
# Descargar dependencias y compilar
mvn clean install

# Ejecutar la aplicación
mvn spring-boot:run

### Un par de consejos adicionales:
* Asegúrate de tener tu archivo `.gitignore` bien configurado en ambas carpetas (frontend y backend) para que no subas la carpeta `node_modules`, ni la carpeta `target`, ni ningún archivo `.env` o `application-dev.properties` que contenga contraseñas locales.
