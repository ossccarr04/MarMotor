# ⚙️ Marmotor API - Backend

Este es el repositorio del backend para **Marmotor**, una plataforma profesional de catálogo y venta de vehículos. Esta API RESTful proporciona todos los servicios necesarios para gestionar coches, usuarios, favoritos y marcas, sirviendo los datos de forma segura al frontend de la aplicación.



## 🛠️ Stack Tecnológico

* **Lenguaje:** Java 17 (o superior)
* **Framework Principal:** Spring Boot 3.x
* **Acceso a Datos:** Spring Data JPA / Hibernate
* **Base de Datos:** MySQL
* **Gestor de Dependencias:** Maven
* **Despliegue en Producción:** Render (API) y Koyeb (Base de datos MySQL)

## 🗄️ Estructura de Datos (Entidades)

La API gestiona las siguientes entidades principales relacionales:
* **Usuario:** Gestión de credenciales y roles integrados (`USER`, `ADMIN`).
* **Marca:** Catálogo de fabricantes.
* **Coche:** Información principal del vehículo, vinculada a una Marca.
* **ImagenCoche:** Sistema de galería fotográfica (Relación 1:N con Coche).
* **Favorito:** Tabla intermedia para que los usuarios guarden sus coches preferidos (Relación N:M).

## 🔒 Configuración de Seguridad

Para garantizar la integridad de los datos de Marmotor, el backend implementa:

1. **Variables de Entorno:** Las credenciales de MySQL (URL, usuario, contraseña) no están en el código. Se leen desde el entorno del sistema operativo.
2. **CORS (Cross-Origin Resource Sharing):** La API está bloqueada por defecto y configurada mediante un archivo `WebConfig.java` para aceptar peticiones **únicamente** desde la URL de producción del frontend en Vercel.
3. **Contraseñas Seguras:** Las contraseñas de los usuarios se almacenan encriptadas (se recomienda BCrypt) antes de guardarse en la base de datos.

---

## ⚙️ Requisitos Previos (Desarrollo Local)

Asegúrate de tener instalado en tu máquina:
* [Java JDK 17+](https://adoptium.net/)
* [Maven](https://maven.apache.org/)
* Servidor MySQL local (o conexión a tu base en Koyeb).

## 🚀 Instalación y Ejecución

### 1. Clonar el repositorio
```bash
git clone [https://github.com/tu-usuario/marmotor-backend.git](https://github.com/tu-usuario/marmotor-backend.git)
cd marmotor-backend
