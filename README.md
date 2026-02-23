# 🚗 VendemosTuCocheFront

<p align="center">
  <img src="https://angular.dev/assets/images/logos/angular/angular.svg" width="100" alt="Angular Logo">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-18.0-DD0031?style=for-the-badge&logo=angular" alt="Angular 18">
  <img src="https://img.shields.io/badge/TypeScript-5.4-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=nodedotjs" alt="Node.js">
  <img src="https://img.shields.io/badge/SSR-Enabled-success?style=for-the-badge" alt="SSR">
</p>

---

## 📖 Descripción

Frontend moderno para la plataforma **VendemosTuCoche**, desarrollado con **Angular 18**. El proyecto utiliza la nueva arquitectura de **Standalone Components**, eliminando la necesidad de módulos tradicionales y optimizando el rendimiento mediante **Server-Side Rendering (SSR)**.

## 📂 Estructura del Proyecto

La organización sigue un patrón modular basado en componentes independientes dentro de la carpeta `src/app`:

```text
src/
└── app/
    ├── module/              
    │   ├── components/      # Componentes de la interfaz
    │   │   ├── header/      # Barra de navegación
    │   │   ├── body/        # Contenido principal
    │   │   └── footer/      # Pie de página
    │   └── services/        # Lógica y conexión a API
    │       └── conexion-bbdd.ts
    ├── app.ts               # Componente raíz (AppComponent)
    ├── app.html             # Template principal
    ├── app.config.ts        # Configuración de Providers y SSR
    └── app.routes.ts        # Definición de rutas
