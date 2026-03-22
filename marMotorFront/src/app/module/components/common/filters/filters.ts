import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
})
export class Filters {
  constructor(private route: Router) {}

  marca = [
    { nombre: 'SEAT', seleccionado: true },
    { nombre: 'BMW', seleccionado: false },
    { nombre: 'AUDI', seleccionado: false },
    { nombre: 'MERCEDES', seleccionado: false },
    { nombre: 'VOLKSWAGEN', seleccionado: false },
    { nombre: 'PEUGEOT', seleccionado: false },
    { nombre: 'RENAULT', seleccionado: false },
    { nombre: 'TOYOTA', seleccionado: false },
    { nombre: 'FORD', seleccionado: false },
    { nombre: 'HYUNDAI', seleccionado: false },
    { nombre: 'KIA', seleccionado: false },
    { nombre: 'NISSAN', seleccionado: false },
    { nombre: 'MAZDA', seleccionado: false },
    { nombre: 'HONDA', seleccionado: false },
    { nombre: 'FIAT', seleccionado: false },
    { nombre: 'VOLVO', seleccionado: false },
    { nombre: 'TESLA', seleccionado: false },
  ];

  contMostrarMarcas = 10;
  isModalMarcasOpen = false;
  terminoBusqueda = '';
  marcaBusqueda = '+';

  // Obtiene solo las 10 primeras marcas para la vista principal
  get marcasPrincipales() {
    return this.marca.slice(0, this.contMostrarMarcas);
  }

  // Filtra las marcas en el modal según lo que el usuario escriba
  get marcasFiltradas() {
    if (!this.terminoBusqueda) {
      return this.marca;
    }
    return this.marca.filter((marca) => {
      return marca.nombre.toLowerCase().includes(this.terminoBusqueda.toLowerCase());
    });
  }

  // Abre el popup
  abrirModalMarcas() {
    this.isModalMarcasOpen = true;
  }

  // Cierra el popup y limpia el buscador
  cerrarModalMarcas() {
    this.isModalMarcasOpen = false;
    this.terminoBusqueda = '';
  }

  // Nueva función unificada para seleccionar marca
  seleccionarMarca(marcaSeleccionada: any) {
    this.marca.forEach((item) => (item.seleccionado = false));
    marcaSeleccionada.seleccionado = true;

    // Averiguamos en qué posición está la marca que acabamos de seleccionar
    const index = this.marca.findIndex((m) => m.nombre === marcaSeleccionada.nombre);

    // Si el índice es 10 o mayor, significa que NO está en las marcasPrincipales
    if (index >= this.contMostrarMarcas) {
      this.marcaBusqueda = marcaSeleccionada.nombre;
    } else {
      // Si está entre las principales, el botón extra vuelve a ser un '+'
      this.marcaBusqueda = '+';
    }
    this.cerrarModalMarcas();
  }

  limpiarMarca() {
    this.marca.forEach((item) => (item.seleccionado = false));
    this.marcaBusqueda = '+';
  }

  carrocerias = [
    { nombre: 'SUV', seleccionado: true },
    { nombre: 'SEDÁN', seleccionado: false },
    { nombre: 'ROADS', seleccionado: false },
  ];

  limpiarCarroceria() {
    this.carrocerias.forEach((item) => (item.seleccionado = false));
  }

  combustibles = [
    { nombre: 'ELÉCTRICO', seleccionado: true },
    { nombre: 'GASOLINA', seleccionado: false },
    { nombre: 'DIESEL', seleccionado: false },
    { nombre: 'HÍBRIDO', seleccionado: false },
    { nombre: 'HÍBRIDO ENCHUFABLE', seleccionado: false }, // Nota: Tienes híbrido dos veces en el diseño original
  ];

  limpiarCombustible() {
    this.combustibles.forEach((item) => (item.seleccionado = false));
  }

  // Variables para el precio
  precioActual = 1000;
  precioMin = 1000;
  precioMax = 20000;
  precioModificado = true; // Siempre activado para enviar el precio

  

  @ViewChild('sliderElement') sliderElement!: ElementRef;
  isDragging = false;

  circunferencia = 2 * Math.PI * 40;

  // --- Funciones Interactivas ---

  // Seleccionar una opción (y desmarcar las demás)
  seleccionarOpcion(lista: any[], index: number) {
    lista.forEach((item) => (item.seleccionado = false));
    lista[index].seleccionado = true;
  }

  get offsetCirculo() {
    const progreso = (this.precioActual - this.precioMin) / (this.precioMax - this.precioMin);
    return this.circunferencia * (1 - progreso);
  }

  // Calcula la posición X del indicador (la bolita blanca)
  get thumbX() {
    const progreso = (this.precioActual - this.precioMin) / (this.precioMax - this.precioMin);
    const angulo = progreso * 2 * Math.PI; // Convertimos el porcentaje a radianes
    return 50 + 40 * Math.cos(angulo); // Centro X (50) + Radio (40) * cos(ángulo)
  }

  // Calcula la posición Y del indicador
  get thumbY() {
    const progreso = (this.precioActual - this.precioMin) / (this.precioMax - this.precioMin);
    const angulo = progreso * 2 * Math.PI;
    return 50 + 40 * Math.sin(angulo); // Centro Y (50) + Radio (40) * sin(ángulo)
  }

  iniciarArrastre(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.actualizarPrecioDesdeEvento(event);
    event.preventDefault(); // Evita que se seleccione texto por accidente
  }

  // Cuando el usuario mueve el ratón o el dedo por la pantalla
  arrastrar(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    this.actualizarPrecioDesdeEvento(event);
  }

  // Cuando el usuario suelta el clic o levanta el dedo
  detenerArrastre() {
    this.isDragging = false;
  }

  // Calcula el porcentaje para el gráfico circular (0 a 100)
  get porcentajePrecio() {
    return ((this.precioActual - this.precioMin) / (this.precioMax - this.precioMin)) * 100;
  }

  private actualizarPrecioDesdeEvento(event: MouseEvent | TouchEvent) {
    // 1. Obtener el centro exacto del círculo en la pantalla
    const rect = this.sliderElement.nativeElement.getBoundingClientRect();
    const centroX = rect.left + rect.width / 2;
    const centroY = rect.top + rect.height / 2;

    // 2. Obtener la posición del ratón o del dedo
    let clienteX, clienteY;
    if (event instanceof MouseEvent) {
      clienteX = event.clientX;
      clienteY = event.clientY;
    } else {
      clienteX = event.touches[0].clientX;
      clienteY = event.touches[0].clientY;
    }

    // 3. Calcular el ángulo usando trigonometría (atan2)
    const x = clienteX - centroX;
    const y = clienteY - centroY;

    // Ajustamos para que las 12 en punto sea el valor 0 (inicio)
    let angulo = Math.atan2(y, x) + Math.PI / 2;
    if (angulo < 0) {
      angulo += 2 * Math.PI; // Corregir valores negativos
    }

    // 4. Convertir el ángulo en un porcentaje (de 0 a 1)
    let porcentaje = angulo / (2 * Math.PI);

    // 5. Calcular el nuevo precio en base al porcentaje
    const rangoPrecio = this.precioMax - this.precioMin;
    let nuevoPrecio = this.precioMin + porcentaje * rangoPrecio;

    // 6. Redondear el precio para que no tenga céntimos feos (ej: va de 500 en 500)
    nuevoPrecio = Math.round(nuevoPrecio / 500) * 500;

    // 7. Asegurar que no se pase de los límites
    if (nuevoPrecio > this.precioMax) nuevoPrecio = this.precioMax;
    if (nuevoPrecio < this.precioMin) nuevoPrecio = this.precioMin;

    this.precioActual = nuevoPrecio;
    this.precioModificado = true; // Si el usuario lo mueve, se activa el filtro
  }

  get marcaActiva() {
    const seleccionada = this.marca.find((m) => m.seleccionado);
    return seleccionada ? seleccionada.nombre : null;
  }

  get carroceriaActiva() {
    const seleccionada = this.carrocerias.find((c) => c.seleccionado);
    return seleccionada ? seleccionada.nombre : null;
  }

  get combustibleActivo() {
    const seleccionada = this.combustibles.find((c) => c.seleccionado);
    return seleccionada ? seleccionada.nombre : null;
  }

  buscarTodos() {
    // Cambia '/galeria' por la ruta real que tengas configurada en tu app.routes.ts
    this.route.navigate(['/coches']);
  }

  // Botón 2: Navega a la galería pasando los filtros por la URL
  buscarConFiltros() {
    const queryParams: any = {};

    // 2. Solo añadimos las propiedades si tienen un valor real
    if (this.marcaActiva) {
      queryParams[btoa('marca')] = btoa(this.marcaActiva);
    }
    if (this.carroceriaActiva) {
      queryParams[btoa('carroceria')] = btoa(this.carroceriaActiva);
    }
    if (this.combustibleActivo){
      queryParams[btoa('combustible')] = btoa(this.combustibleActivo);
    } 
      queryParams[btoa('precio')] = btoa(this.precioActual.toString());


    //! Acordarme de aqui desencriptar al recibir la informacion

    // Navegamos a la ruta y le adjuntamos los filtros
    this.route.navigate(['/coches'], { queryParams: queryParams });
  }
}
