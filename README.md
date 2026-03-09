# 🚗 Marmotor - Plataforma de Venta de Vehículos

Una aplicación web Full-Stack diseñada para la exploración, búsqueda y gestión de un catálogo de vehículos. Permite a los usuarios registrarse, guardar sus coches favoritos y visualizar galerías de imágenes detalladas, todo bajo una arquitectura segura y escalable.

## 📋 Características Principales

* **Catálogo de Vehículos:** Visualización dinámica de coches con su información detallada (marca, modelo, año, precio).
* **Búsqueda Personalizada:** Filtros avanzados para encontrar vehículos específicos.
* **Galería de Imágenes:** Sistema de múltiples imágenes por vehículo (relación 1:N).
* **Sistema de Usuarios y Favoritos:** Registro de usuarios, gestión de roles (USER/ADMIN) y capacidad de guardar vehículos en una lista de favoritos personalizada (relación N:M).
* **Seguridad Robusta:** Implementación de prácticas estándar de la industria para proteger datos y comunicaciones.

## 🛠️ Tecnologías y Despliegue

* **Frontend:** Angular, TypeScript, HTML/SCSS. (Desplegado en **Vercel**)
* **Backend:** Java, Spring Boot, Spring Data JPA, Hibernate. (Desplegado en **Render**)
* **Base de Datos:** MySQL relacional. (Desplegada en **Koyeb**)

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
1. **Protección de Credenciales:** Uso exclusivo de Variables de Entorno (`application.properties`) para evitar la exposición de contraseñas de la base de datos en el código fuente.
2. **Control de Acceso (CORS):** El servidor está configurado para rechazar cualquier petición HTTP que no provenga del dominio oficial del frontend en Vercel.
3. **Prevención de Inyecciones SQL:** Uso de Spring Data JPA e Hibernate, que sanitizan automáticamente las consultas a la base de datos.
4. **Cifrado en Tránsito:** Todas las comunicaciones en producción están protegidas mediante HTTPS/SSL.

### Seguridad en el Frontend (Angular)
1. **Sanitización Automática:** Protección nativa contra ataques XSS (Cross-Site Scripting).
2. **Gestión de Entornos:** Uso de `environment.ts` y `environment.prod.ts` para separar las URLs locales de las de producción.

---

## ⚙️ Requisitos Previos

Para ejecutar este proyecto en local, necesitas tener instalado:
* **Java 17** o superior.
* **Node.js** (v18+) y **NPM**.
* **Angular CLI** (v16+).
* **MySQL Server** local (o las credenciales de la base de datos en Koyeb).
* **Maven**.

---

## 🚀 Instalación y Ejecución Local

### 1. Configuración de la Base de Datos (MySQL)
1. Crea una base de datos local (ej. `autocatalog_db`).
2. Configura tus credenciales en el archivo del backend: `src/main/resources/application.properties`.
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/autocatalog_db
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña
