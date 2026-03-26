# 🚗 Documentación del Proyecto: MarMotorBackend

## 📖 Resumen del Proyecto
**MarMotorBackend** es una API RESTful desarrollada con Spring Boot para una aplicación web Full-Stack. Su objetivo es gestionar un catálogo avanzado de vehículos, permitiendo la exploración, filtrado, gestión de inventario y la interacción de los usuarios (autenticación y sistema de favoritos).

---

## 🔒 Arquitectura de Seguridad y Protección de Rutas

Actualmente, la aplicación permite tráfico abierto (`permitAll()`). Para que la aplicación sea segura y esté lista para producción, el equipo de backend debe implementar una arquitectura basada en **JWT (JSON Web Tokens)** y **Control de Acceso Basado en Roles (RBAC)**.

### 1. Autenticación (JWT)
*   **Stateless:** La API no guardará estado de las sesiones. Cada solicitud protegida debe incluir un token JWT válido en el header `Authorization: Bearer <token>`.
*   **Filtro de Seguridad (`JwtAuthenticationFilter`):** Interceptará las peticiones, verificará la firma del JWT, comprobará su caducidad y extraerá el usuario para inyectarlo en el `SecurityContextHolder`.
*   **Encriptación de Contraseñas:** Se utiliza `BCryptPasswordEncoder` (ya configurado) para que las contraseñas nunca se guarden en texto plano en la base de datos.

### 2. Autorización (Roles y Protección de Rutas)
El modelo de usuarios debe incluir una entidad `Role` (Ej: `USER`, `ADMIN`). La configuración en `SecurityConfig` se definirá de la siguiente manera:

*   🌍 **Rutas Públicas (`permitAll`):** 
    *   Lectura del catálogo: `GET /api/cars/**`, `GET /api/brands`, `GET /api/body-types`, `GET /api/fuel-types`.
    *   Autenticación: `POST /api/auth/login`, `POST /api/auth/register`.
*   👤 **Rutas de Usuario (`hasRole('USER')` o `authenticated`):**
    *   Gestión de perfil y sistema de favoritos.
*   🛡️ **Rutas de Administrador (`hasRole('ADMIN')`):**
    *   Creación, modificación y eliminación del catálogo (Coches, Marcas, Imágenes).

---

## 🚀 Endpoints de la API (Por Controlador)

**Nota sobre DTOs en Coches:** Existen endpoints que devuelven `CarDTO` (datos ligeros para listas rápidas) y otros que devuelven `CarDetailDTO` (datos pesados que incluyen características, historial y galería completa, ideales para vistas en detalle o secciones destacadas).

Leyenda:
*   ✅ **Implementado**
*   ❌ **Pendiente de implementar por el equipo**

### 1. 🔐 `AuthController` (Controlador Pendiente)
Encargado de la gestión de acceso de usuarios.

| Estado | Método | Ruta | Acceso | Descripción |
| :---: | :--- | :--- | :--- | :--- |
| ❌ | `POST` | `/api/auth/register` | 🌍 Público | Crea una nueva cuenta de usuario (Mover desde `UserController`). |
| ❌ | `POST` | `/api/auth/login` | 🌍 Público | Valida credenciales y devuelve un token JWT. |

### 2. 🚘 `CarController`
Gestión principal del catálogo de vehículos.

| Estado | Método | Ruta | Acceso | Descripción |
| :---: | :--- | :--- | :--- | :--- |
| ✅ | `GET` | `/api/cars` | 🌍 Público | Obtiene todos los coches (datos ligeros - `CarDTO`). |
| ❌ | `GET` | `/api/cars/detailed` | 🌍 Público | Obtiene **todos** los coches con detalles completos (`CarDetailDTO`). |
| ✅ | `GET` | `/api/cars/filters` | 🌍 Público | Búsqueda filtrada devolviendo datos ligeros (`CarDTO`). |
| ❌ | `GET` | `/api/cars/filters/detailed`| 🌍 Público | Búsqueda filtrada devolviendo detalles completos (`CarDetailDTO`). |
| ❌ | `GET` | `/api/cars/category/{category}`| 🌍 Público | Top 10 coches por categoría (Ej: 'New', 'Premium') con detalles completos. |
| ✅ | `GET` | `/api/cars/{id}` | 🌍 Público | Obtiene los datos básicos de un coche (`CarDTO`). |
| ✅ | `GET` | `/api/cars/{id}/detail`| 🌍 Público | Obtiene los detalles completos de un coche (`CarDetailDTO`). |
| ✅ | `POST` | `/api/cars` | 🛡️ Admin | Crea un nuevo coche en el sistema. |
| ❌ | `PUT` | `/api/cars/{id}` | 🛡️ Admin | Actualiza la información de un coche existente. |
| ✅ | `DELETE` | `/api/cars/{id}` | 🛡️ Admin | Elimina un coche del catálogo. |

### 3. 🏷️ `BrandController`
Gestión de marcas de vehículos.

| Estado | Método | Ruta | Acceso | Descripción |
| :---: | :--- | :--- | :--- | :--- |
| ✅ | `GET` | `/api/brands` | 🌍 Público | Lista todas las marcas disponibles. |
| ✅ | `POST` | `/api/brands` | 🛡️ Admin | Añade una nueva marca. |
| ❌ | `PUT` | `/api/brands/{id}` | 🛡️ Admin | Edita el nombre/país de una marca. |
| ✅ | `DELETE` | `/api/brands/{id}` | 🛡️ Admin | Elimina una marca. |

### 4. 🖼️ `CarImageController`
Gestión de la galería de imágenes (Relación 1:N con Coches).

| Estado | Método | Ruta | Acceso | Descripción |
| :---: | :--- | :--- | :--- | :--- |
| ✅ | `POST` | `/api/images/car/{id}` | 🛡️ Admin | Sube/asocia una nueva imagen a un coche. |
| ✅ | `PATCH` | `/api/images/{imgId}/car/{carId}/set-main` | 🛡️ Admin | Define una imagen como la principal (portada). |
| ✅ | `DELETE` | `/api/images/{id}` | 🛡️ Admin | Elimina una imagen específica. |

### 5. ⭐ `UserController` / `FavoritesController` (Pendiente)
Gestión del perfil y sistema de guardados (Relación N:M entre Usuario y Coches).

| Estado | Método | Ruta | Acceso | Descripción |
| :---: | :--- | :--- | :--- | :--- |
| ❌ | `GET` | `/api/users/me/favorites` | 👤 Usuario | Obtiene la lista de coches favoritos del usuario logueado. |
| ❌ | `POST` | `/api/users/me/favorites/{carId}` | 👤 Usuario | Añade un coche a la lista de favoritos. |
| ❌ | `DELETE`| `/api/users/me/favorites/{carId}` | 👤 Usuario | Elimina un coche de la lista de favoritos. |

### 6. ⚙️ Controladores Auxiliares (`BodyType` y `FuelType`)

| Estado | Método | Ruta | Acceso | Descripción |
| :---: | :--- | :--- | :--- | :--- |
| ✅ | `GET` | `/api/body-types` | 🌍 Público | Lista tipos de carrocería (Coupe, SUV, etc). |
| ✅ | `GET` | `/api/fuel-types` | 🌍 Público | Lista tipos de combustible (Gasolina, Eléctrico, etc). |

---

## 🛠️ Tareas Pendientes para el Equipo de Backend (To-Do List)

1. **Configurar JWT y AuthController:** Implementar `JwtTokenProvider`, el filtro de validación web y la carga del usuario mediante `UserDetailsService`. Crear los endpoints de login y registro.
2. **Aplicar roles en `SecurityConfig`:** Configurar `.requestMatchers()` para proteger los endpoints CUD (Create, Update, Delete) asignándoles el rol `.hasRole("ADMIN")`.
3. **Migrar sistema de DTOs en las peticiones POST/PUT:** Crear `CarCreateDTO` y `BrandCreateDTO` en lugar de recibir la Entidad entera por `@RequestBody`. Implementar también los métodos `PUT` faltantes.
4. **Implementar Sistema de Favoritos:** Crear la tabla intermedia (`user_favorites`) mapeando una relación `@ManyToMany` entre las entidades `User` y `Car`.
5. **Manejo Global de Excepciones:** Crear una clase con `@RestControllerAdvice` para capturar errores (Ej: `EntityNotFoundException`, `IllegalArgumentException`) y devolver un JSON estandarizado al frontend.
