# 🚗 MarMotor - Plataforma de Gestión de Concesionario

**MarMotor** es una solución Full-Stack integral diseñada para la gestión de inventario, usuarios y servicios de un concesionario de vehículos. Este proyecto ha sido desarrollado como Trabajo de Fin de Grado (TFG), implementando una arquitectura moderna, segura y escalable.

---

## 🏗️ Estructura del Proyecto (Monorepo)

El repositorio utiliza una estructura de monorepo para facilitar la gestión del ciclo de vida de la aplicación:

* **/marMotorBackend**: API REST robusta construida con **Spring Boot 3**. Gestiona la lógica de negocio, seguridad y persistencia.
* **/marMotorFrontend**: Interfaz de usuario reactiva desarrollada en **Angular**, enfocada en la experiencia de usuario (UX) y el diseño responsivo.

---

## 🛠️ Tecnologías Utilizadas

### Backend
* **Java 17 & Spring Boot 3**: Núcleo del servidor.
* **Spring Security + JWT**: Sistema de autenticación y autorización basado en tokens.
* **MySQL (Aiven)**: Base de datos relacional alojada en la nube.
* **Cloudinary**: Gestión y almacenamiento optimizado de imágenes de vehículos.
* **Docker**: Empaquetado mediante *multi-stage builds* para despliegues eficientes.

### Frontend
* **Angular**: Framework principal para el desarrollo de la SPA.
* **TypeScript**: Tipado fuerte para un código más mantenible.
* **Tailwind CSS / Bootstrap**: Maquetación moderna y adaptativa.
* **Interceptor Pattern**: Gestión centralizada de tokens JWT y cabeceras HTTP.

---

## 🚀 Despliegue en Producción

La aplicación se encuentra desplegada y operativa en los siguientes entornos:

| Componente | Plataforma | URL de Acceso |
| :--- | :--- | :--- |
| **Frontend** | Vercel | `https://marmotor.vercel.app` |
| **API Backend** | Render | `https://marmotor.onrender.com` |
| **Base de Datos** | Aiven | MySQL 8.0 Cloud |

> [!IMPORTANT]
> **Aviso de Inicio en Frío (Cold Start):** Debido al uso de la capa gratuita de Render, el servidor entra en estado de hibernación tras 15 minutos de inactividad. Se ha implementado un sistema en el Frontend que detecta este estado y avisa al usuario mediante un banner informativo mientras el servidor "despierta" (aprox. 50 segundos).

---

## ⚙️ Configuración del Sistema

### Variables de Entorno Necesarias
Para el correcto funcionamiento del sistema, se deben configurar las siguientes claves (ya sea en un archivo `.env` local o en el panel de control del hosting):

**Backend:**
* `DB_URL`: Endpoint de la base de datos MySQL.
* `DB_USER` / `DB_PASS`: Credenciales de acceso.
* `CL_NAME` / `CL_KEY` / `CL_SECRET`: API Keys de Cloudinary.
* `JWT_S`: Clave secreta para la generación de tokens.
* `MAIL_USER` / `MAIL_PASS`: Configuración SMTP para el servicio de correo.

**Frontend:**
* `apiUrl`: URL de la API (ajustada según el entorno en `environment.prod.ts`).

---

## 📦 Instalación y Ejecución Local

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/oscdaw202401/TFGDAM.git](https://github.com/oscdaw202401/TFGDAM.git)
    ```

2.  **Lanzar el Backend:**
    ```bash
    cd marMotorBackend
    # Asegúrate de tener configuradas tus variables de entorno locales
    mvn spring-boot:run
    ```

3.  **Lanzar el Frontend:**
    ```bash
    cd marMotorFrontend
    npm install
    ng serve
    ```
    La aplicación estará disponible en `http://localhost:4200`.

---

## 🛡️ Funcionalidades Clave
* **Gestión de Vehículos:** CRUD completo con carga dinámica de imágenes.
* **Seguridad:** Rutas protegidas y gestión de roles.
* **Recuperación de Cuenta:** Sistema de envío de correos para restablecimiento de contraseñas.
* **UX Optimizada:** Notificaciones de estado del servidor y cargadores visuales.

---
**Desarrollado por Oscar Acedo - 2026**
