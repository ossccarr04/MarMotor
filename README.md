# TFGDAM
VendemosTuCocheFront 🚗
Este proyecto ha sido desarrollado con Angular 18, utilizando la arquitectura moderna de Standalone Components (sin módulos tradicionales) y soporte para Server-Side Rendering (SSR).

🛠️ Estructura del Proyecto
La organización del código sigue las nuevas convenciones de Angular:

src/app/: Núcleo de la aplicación.

components/: Contiene los componentes visuales organizados por secciones (header, body, footer).

services/: Lógica de negocio y comunicación con APIs (ej. conexion-bbdd.ts).

app.ts: Componente raíz de la aplicación (sustituye al antiguo app.component.ts).

app.config.ts: Configuración global de proveedores y servicios.

app.routes.ts: Definición de las rutas de navegación.

server.ts: Configuración del servidor para el renderizado del lado del servidor (SSR).

🚀 Comandos Rápidos
Para empezar a trabajar en el proyecto, usa los siguientes comandos en la terminal:

Servidor de Desarrollo
Ejecuta la aplicación en modo local. La web se actualizará automáticamente al guardar cambios.

Bash
ng serve
Accede a: http://localhost:4200

Generar nuevos elementos
Para mantener la consistencia, usa el CLI de Angular:

Componentes: ng generate component nombre-componente

Servicios: ng generate service services/nombre-servicio

Construcción (Build)
Para compilar el proyecto y prepararlo para producción:

Bash
ng build
💡 Notas de Arquitectura (Angular 18)
Standalone: Este proyecto no utiliza NgModule. Cada componente gestiona sus propias dependencias a través del array imports en su decorador @Component.

Hydration: Se ha implementado Client Hydration con withEventReplay() en app.config.ts para mejorar el rendimiento y la experiencia de usuario en la carga inicial.
