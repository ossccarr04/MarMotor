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

```
🛠️ Tecnologías y Características
Angular 18: Última versión estable con Signals y nuevo flujo de control.

Standalone Architecture: Componentes independientes que se gestionan sin NgModules.

SSR & Hydration: Renderizado en servidor con withEventReplay() para mejor SEO.

TypeScript: Tipado estricto para un código más robusto.

🚀 Instalación y Uso
Requisitos previos
Node.js: v20 o superior.

Angular CLI: v18 o superior.

Pasos para ejecutar
1. Clonar el repositorio:

Bash
git clone [https://github.com/tu-usuario/vendemosTuCocheFront.git](https://github.com/tu-usuario/vendemosTuCocheFront.git)
cd vendemosTuCocheFront
2. Instalar dependencias:

Bash
npm install
3. Arrancar el servidor de desarrollo:

Bash
ng serve
🌍 Visita: http://localhost:4200

🏗️ Guía de Comandos CLI
| Acción | Comando |
| :--- | :--- |
| **Nuevo Componente** | `ng generate component module/components/nombre` |
| **Nuevo Servicio** | `ng generate service module/services/nombre` |
| **Build Producción** | `ng build` |
| **Ejecutar Tests** | `ng test` |

✅ Próximos Pasos (To-Do)
[ ] Implementar la conexión real en conexion-bbdd.ts.

[ ] Configurar las rutas principales en app.routes.ts.

[ ] Añadir validaciones de formularios en el componente de contacto.

[ ] Optimizar imágenes en la carpeta public/.
