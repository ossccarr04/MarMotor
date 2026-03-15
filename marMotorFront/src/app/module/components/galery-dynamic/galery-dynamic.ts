import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-galery-dynamic',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './galery-dynamic.html',
  styleUrl: './galery-dynamic.scss',
})
export class GaleryDynamic {

  @ViewChild('carrusel') carrusel!: ElementRef

  coches = [
    {
      nombre: 'TESLA MODEL Y',
      precio: 48500,
      imagen: 'assets/tesla_model_y.jpg',
      km: 324,
      motor: 19,
      consumo: '3.5%',
      mes: 123,
      etiqueta: 'DESTACADO', // Puede ser 'DESTACADO', 'NOVEDAD', o null si no tiene
      tipoEtiqueta: 'featured', // Usamos esto para la clase CSS (badge-featured)
      guardado: false
    },
    {
      nombre: 'SEAT ATECA',
      precio: 48500,
      imagen: 'assets/car2.png',
      km: 324,
      motor: 19,
      consumo: '3.5%',
      mes: 123,
      etiqueta: 'NOVEDAD',
      tipoEtiqueta: 'new', // Clase CSS (badge-new)
      guardado: false
    },
    {
      nombre: 'AUDI Q4 E-TRON',
      precio: 52000,
      imagen: 'assets/car1.png', // Reemplaza con tu imagen
      km: 400,
      motor: 22,
      consumo: '3.1%',
      mes: 140,
      etiqueta: null, // Este coche no tiene etiqueta arriba
      tipoEtiqueta: null,
      guardado: false
    },
    {
      nombre: 'TESLA MODEL Y',
      precio: 48500,
      imagen: 'assets/tesla_model_y.jpg',
      km: 324,
      motor: 19,
      consumo: '3.5%',
      mes: 123,
      etiqueta: 'DESTACADO', // Puede ser 'DESTACADO', 'NOVEDAD', o null si no tiene
      tipoEtiqueta: 'featured', // Usamos esto para la clase CSS (badge-featured)
      guardado: false
    },
    {
      nombre: 'TESLA MODEL Y',
      precio: 48500,
      imagen: 'assets/tesla_model_y.jpg',
      km: 324,
      motor: 19,
      consumo: '3.5%',
      mes: 123,
      etiqueta: 'DESTACADO', // Puede ser 'DESTACADO', 'NOVEDAD', o null si no tiene
      tipoEtiqueta: 'featured', // Usamos esto para la clase CSS (badge-featured)
      guardado: false
    },
    {
      nombre: 'TESLA MODEL Y',
      precio: 48500,
      imagen: 'assets/tesla_model_y.jpg',
      km: 324,
      motor: 19,
      consumo: '3.5%',
      mes: 123,
      etiqueta: 'DESTACADO', // Puede ser 'DESTACADO', 'NOVEDAD', o null si no tiene
      tipoEtiqueta: 'featured', // Usamos esto para la clase CSS (badge-featured)
      guardado: false
    },
    {
      nombre: 'TESLA MODEL Y',
      precio: 48500,
      imagen: 'assets/tesla_model_y.jpg',
      km: 324,
      motor: 19,
      consumo: '3.5%',
      mes: 123,
      etiqueta: 'DESTACADO', // Puede ser 'DESTACADO', 'NOVEDAD', o null si no tiene
      tipoEtiqueta: 'featured', // Usamos esto para la clase CSS (badge-featured)
      guardado: false
    },
    {
      nombre: 'TESLA MODEL Y',
      precio: 48500,
      imagen: 'assets/tesla_model_y.jpg',
      km: 324,
      motor: 19,
      consumo: '3.5%',
      mes: 123,
      etiqueta: 'DESTACADO', // Puede ser 'DESTACADO', 'NOVEDAD', o null si no tiene
      tipoEtiqueta: 'featured', // Usamos esto para la clase CSS (badge-featured)
      guardado: false
    },
    {
      nombre: 'TESLA MODEL Y',
      precio: 48500,
      imagen: 'assets/tesla_model_y.jpg',
      km: 324,
      motor: 19,
      consumo: '3.5%',
      mes: 123,
      etiqueta: 'DESTACADO', // Puede ser 'DESTACADO', 'NOVEDAD', o null si no tiene
      tipoEtiqueta: 'featured', // Usamos esto para la clase CSS (badge-featured)
      guardado: false
    },
    {
      nombre: 'TESLA MODEL Y',
      precio: 48500,
      imagen: 'assets/tesla_model_y.jpg',
      km: 324,
      motor: 19,
      consumo: '3.5%',
      mes: 123,
      etiqueta: 'DESTACADO', // Puede ser 'DESTACADO', 'NOVEDAD', o null si no tiene
      tipoEtiqueta: 'featured', // Usamos esto para la clase CSS (badge-featured)
      guardado: false
    }
  ];

  toggleGuardar(coche: any) {
    coche.guardado = !coche.guardado;

  }


  moverCarrusel(direccion: number) {
    if (this.carrusel) {
      const elemento = this.carrusel.nativeElement;
      
      // La distancia a mover: Ancho de la tarjeta (380px) + Gap (40px)
      const distanciaMovimiento = 420; 
      
      // Calculamos el ancho máximo que se puede hacer scroll
      // (Ancho total del contenido interno MENOS el ancho visible en la pantalla)
      const scrollMaximo = elemento.scrollWidth - elemento.clientWidth;
      
      const posicionActual = Math.ceil(elemento.scrollLeft);

      // --- LÓGICA DEL BUCLE ---

      // 1. Si vamos a la DERECHA (1) y ya estamos al final del todo
      // Usamos "- 10" como margen de seguridad por si los navegadores redondean los píxeles
      if (direccion === 1 && posicionActual >= scrollMaximo - 10) {
        // Hacemos "rebobinado" suave hasta el principio (posición 0)
        elemento.scrollTo({ left: 0, behavior: 'smooth' });
      } 
      // 2. Si vamos a la IZQUIERDA (-1) y estamos en el principio (posición 0)
      else if (direccion === -1 && posicionActual <= 10) {
        // Saltamos suavemente hasta el final del todo
        elemento.scrollTo({ left: scrollMaximo, behavior: 'smooth' });
      } 
      // 3. Comportamiento normal si estamos por el medio
      else {
        elemento.scrollBy({ left: distanciaMovimiento * direccion, behavior: 'smooth' });
      }
    }
  }
}
  

