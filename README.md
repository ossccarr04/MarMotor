# ⚙️ MarMotor - Backend API

<p align="center">
  <img src="https://img.shields.io/badge/Spring_Boot-3.X-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/Java-17+-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
  <img src="https://img.shields.io/badge/Render-Deployed-46E3B7?style=for-the-badge&logo=render&logoColor=white" alt="Render">
</p>

---

## 📖 Descripción

Este es el repositorio del servidor (Backend) para **VendemosTuCoche**, una plataforma integral de catálogo y venta de vehículos. Esta API RESTful está construida con **Spring Boot** y se encarga de gestionar la lógica de negocio, la seguridad, la persistencia de datos y la comunicación segura con el frontend en Angular.

[Image of Spring Boot MVC architecture diagram showing Controllers, Services, Repositories and MySQL Database]

## 🛠️ Stack Tecnológico

* **Framework Principal:** Spring Boot (Web, Data JPA, Security, Validation)
* **Lenguaje:** Java 17+
* **Base de Datos:** MySQL
* **Herramientas:** Maven (Gestor de dependencias), Lombok (Reducción de código repetitivo)
* **Despliegue:** * API alojada en **Render**.
  * Base de Datos alojada en **Koyeb**.

## 🗄️ Arquitectura de Datos

El sistema utiliza un modelo relacional optimizado, gestionado a través de **Hibernate/JPA**, que incluye las siguientes entidades:
* `Usuarios`: Gestión de autenticación y roles (`USER`, `ADMIN`).
* `Marcas`: Catálogo de fabricantes.
* `Coches`: Detalles técnicos y de venta de los vehículos (vinculados a marcas).
* `ImagenesCoche`: Sistema de galería fotográfica (Relación 1:N con Coches).
* `Favoritos`: Tabla intermedia (N:M) que permite a los usuarios guardar vehículos que les interesan.

## 🔒 Seguridad y Entornos

El proyecto aplica prácticas de seguridad estándar de la industria:
1. **Configuración por Perfiles:** Uso de `spring.profiles.active` para separar entornos.
2. **Protección de Credenciales:** El archivo principal `application.properties` utiliza variables de entorno (ej. `${DB_PASSWORD}`) que son inyectadas por Render en producción. Las contraseñas locales se gestionan en un archivo `application-dev.properties` excluido del control de versiones (Git).
3. **CORS:** El servidor está configurado para rechazar cualquier petición HTTP que no provenga estrictamente de la URL de producción del frontend.

---

## 🚀 Instalación y Uso (Desarrollo Local)

### Requisitos previos
* **Java JDK 17** o superior.
* **Maven** instalado.
* **MySQL Server** funcionando en `localhost:3306`.

### Pasos para ejecutar

**1. Clonar el repositorio:**
```bash
git clone [https://github.com/tu-usuario/vendemosTuCocheBackend.git](https://github.com/tu-usuario/vendemosTuCocheBackend.git)
cd vendemosTuCocheBackend
