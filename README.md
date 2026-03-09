# 🚗 Marmotor - Plataforma de Venta de Vehículos

<p align="center">
  <img src="https://img.shields.io/badge/Angular-18.0-DD0031?style=for-the-badge&logo=angular" alt="Angular 18">
  <img src="https://img.shields.io/badge/Spring_Boot-3.X-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white" alt="Spring Boot">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
</p>

Una aplicación web Full-Stack diseñada para la exploración, búsqueda y gestión de un catálogo de vehículos. Permite a los usuarios registrarse, guardar sus coches favoritos y visualizar galerías de imágenes detalladas, todo bajo una arquitectura segura y escalable.

## 📋 Características Principales

* **Catálogo de Vehículos:** Visualización dinámica de coches con su información detallada (marca, modelo, año, precio).
* **Búsqueda Personalizada:** Filtros avanzados para encontrar vehículos específicos.
* **Galería de Imágenes:** Sistema de múltiples imágenes por vehículo (relación 1:N).
* **Sistema de Usuarios y Favoritos:** Registro de usuarios, gestión de roles integrados (`USER`/`ADMIN`) y capacidad de guardar vehículos en una lista de favoritos personalizada (relación N:M).
* **Seguridad Robusta:** Implementación de prácticas estándar de la industria para proteger datos y comunicaciones.

## 🛠️ Tecnologías y Despliegue

* **Frontend:** Angular 18 (Standalone Components, SSR), TypeScript, HTML/SCSS. (Desplegado en **Vercel**).
* **Backend:** Java 17+, Spring Boot, Spring Data JPA, Hibernate. (Desplegado en **Render**).
* **Base de Datos:** MySQL relacional. (Desplegada en **Koyeb**).

## 🗄️ Arquitectura de la Base de Datos

La aplicación utiliza un modelo relacional optimizado para un rendimiento rápido:



* `usuarios`: Gestiona la autenticación e incluye el nivel de acceso (columna `rol`).
* `marcas`: Catálogo de fabricantes independientes.
* `coches`: Información central del vehículo (incluye la columna `modelo` y conecta con la marca).
* `imagenes_coche`: Galería fotográfica vinculada a cada vehículo.
* `favoritos`: Tabla intermedia que relaciona qué usuarios han guardado qué coches.

## 🔒 Arquitectura de Seguridad

Se han implementado múltiples capas de seguridad tanto en el cliente como en el servidor:

### Seguridad en el Backend (Spring Boot)
1. **Protección de Credenciales (Perfiles):** Uso exclusivo de Variables de Entorno (`application.properties`) inyectadas en producción. En desarrollo, las contraseñas residen en un archivo `application-dev.properties` que está excluido del control de versiones (`.gitignore`).
2. **Control de Acceso (CORS):** El servidor está configurado para rechazar cualquier petición HTTP que no provenga del dominio oficial del frontend en Vercel.
3. **Prevención de Inyecciones SQL:** Uso de Spring Data JPA e Hibernate, que sanitizan automáticamente las consultas a la base de datos.
4. **Cifrado en Tránsito:** Todas las comunicaciones en producción están protegidas mediante HTTPS/SSL.

### Seguridad en el Frontend (Angular)
1. **Sanitización Automática:** Protección nativa contra ataques XSS (Cross-Site Scripting).
2. **Gestión de Entornos:** Uso de *File Replacement* (`environments`) para apuntar dinámicamente a URLs locales durante el desarrollo y a la API segura de Render en producción.

---

## ⚙️ Requisitos Previos

Para ejecutar este proyecto en local, necesitas tener instalado:
* **Java:** JDK 17 o superior.
* **Node.js:** Versión 20+ y NPM.
* **Angular CLI:** Versión 18+.
* **MySQL:** Servidor local activo en el puerto 3306.
* **Maven:** Gestor de dependencias de Java.

---

## 🚀 Instalación y Ejecución Local

### 1. Configuración de la Base de Datos (MySQL)
1. Inicia tu servidor MySQL.
2. Crea una base de datos local llamada `marmotor_db`.

### 2. Levantar el Backend (Spring Boot)
1. Navega a la carpeta del backend.
2. Crea un archivo `src/main/resources/application-dev.properties` (asegúrate de que esté en tu `.gitignore`) y añade tus credenciales locales:
```properties
spring.datasource.password=tu_contraseña_local
