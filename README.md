# 🏎️ Marmotor Web - Frontend (Angular)

Este es el repositorio del cliente web (Frontend) para **Marmotor**, una plataforma moderna para la exploración y gestión de un catálogo de vehículos. Construida con Angular, esta aplicación ofrece una interfaz de usuario rápida, reactiva y completamente responsiva (adaptable a móviles y escritorio).



## 🛠️ Stack Tecnológico

* **Framework Principal:** Angular 16+
* **Lenguaje:** TypeScript
* **Estilos:** SCSS / CSS3
* **Peticiones HTTP:** `HttpClient` y RxJS
* **Despliegue en Producción:** Vercel

## ✨ Características de la Interfaz

* **Catálogo Dinámico:** Tarjetas de vehículos con su imagen principal, marca, modelo y precio.
* **Sistema de Búsqueda y Filtros:** Búsqueda en tiempo real conectada a la API de Spring Boot.
* **Vista de Detalles:** Páginas dinámicas (`/coches/:id`) que muestran la galería completa de imágenes y especificaciones del vehículo.
* **Gestión de Favoritos:** Interfaz intuitiva con botones de "Me gusta" (❤️) para que los usuarios guarden sus coches preferidos.
* **Control de Acceso (UI):** Renderizado condicional basado en roles (ej. los botones de "Añadir Coche" solo son visibles si el usuario tiene el rol `ADMIN`).

## 🔒 Seguridad y Configuración

1. **Protección XSS Nativa:** Angular purifica automáticamente todos los valores vinculados al DOM, previniendo ataques de Cross-Site Scripting.
2. **Gestión de Entornos (`environments`):** La aplicación está configurada para apuntar dinámicamente a la API correcta sin exponer código.
   * En desarrollo (`environment.ts`): Apunta a `http://localhost:8080`.
   * En producción (`environment.prod.ts`): Apunta a la URL segura (HTTPS) de tu backend alojado en Render.

---

## ⚙️ Requisitos Previos (Desarrollo Local)

Para ejecutar este proyecto en tu entorno local, asegúrate de tener instalado:
* [Node.js](https://nodejs.org/) (Versión 18.x o superior)
* [Angular CLI](https://angular.io/cli) (Instalable vía `npm install -g @angular/cli`)

## 🚀 Instalación y Ejecución Local

### 1. Clonar el repositorio e instalar dependencias
Abre tu terminal y ejecuta:
```bash
git clone [https://github.com/tu-usuario/marmotor-frontend.git](https://github.com/tu-usuario/marmotor-frontend.git)
cd marmotor-frontend
npm install

[ ] Añadir validaciones de formularios en el componente de contacto.

[ ] Optimizar imágenes en la carpeta public/.
