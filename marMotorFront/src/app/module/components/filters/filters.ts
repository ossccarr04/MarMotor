import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-filters',
  imports: [RouterModule, CommonModule],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
})
export class Filters {

  carrocerias = [
    { nombre: 'SUV', seleccionado: true },
    { nombre: 'SEDÁN', seleccionado: false },
    { nombre: 'ROADS', seleccionado: false },
  ];

  combustibles = [
    { nombre: 'ELÉCTRICO', seleccionado: true },
    { nombre: 'HÍBRIDO', seleccionado: false },
    { nombre: 'MISMO', seleccionado: false },
    { nombre: 'HÍBRIDO', seleccionado: false } // Nota: Tienes híbrido dos veces en el diseño original
  ];

  // Variables para el precio
  precioActual = 48500;
  precioMin = 900;
  precioMax = 50100;
  
  @ViewChild('sliderElement') sliderElement!: ElementRef;
  isDragging = false;

  circunferencia = 2 * Math.PI * 40;

  // --- Funciones Interactivas ---

  // Seleccionar una opción (y desmarcar las demás)
  seleccionarOpcion(lista: any[], index: number) {
    lista.forEach(item => item.seleccionado = false);
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
    return 50 + 40 * Math.cos(angulo);     // Centro X (50) + Radio (40) * cos(ángulo)
  }

  // Calcula la posición Y del indicador
  get thumbY() {
    const progreso = (this.precioActual - this.precioMin) / (this.precioMax - this.precioMin);
    const angulo = progreso * 2 * Math.PI;
    return 50 + 40 * Math.sin(angulo);     // Centro Y (50) + Radio (40) * sin(ángulo)
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
    let nuevoPrecio = this.precioMin + (porcentaje * rangoPrecio);

    // 6. Redondear el precio para que no tenga céntimos feos (ej: va de 500 en 500)
    nuevoPrecio = Math.round(nuevoPrecio / 100) * 100;

    // 7. Asegurar que no se pase de los límites
    if (nuevoPrecio > this.precioMax) nuevoPrecio = this.precioMax;
    if (nuevoPrecio < this.precioMin) nuevoPrecio = this.precioMin;

    this.precioActual = nuevoPrecio;
  }
}
