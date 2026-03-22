import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CarDTO } from '../../../../@types/interface/car.interface';
import { CarServiceBBDD } from '../../../services/car-service-bbdd';


@Component({
  selector: 'app-galery-dynamic',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './galery-dynamic.html',
  styleUrl: './galery-dynamic.scss',
})
export class GaleryDynamic {
  private carservice= inject(CarServiceBBDD)
  private router = inject(Router);

  @ViewChild('carrusel') carrusel!: ElementRef;

  coches: CarDTO[] = []

  ngOnInit(): void {

  
  this.carservice.getCars().subscribe({
    next: (data) => {
      this.coches = data;
    },
    error: (err) => {
      console.error('Error de conexión o de API:', err);
    }
  });
  }


  toggleGuardar(coche: CarDTO) {
    coche.isSaved = !coche.isSaved;
  }

  moverCarrusel(direccion: number) {
    if (this.carrusel) {
      const elemento = this.carrusel.nativeElement;

      // Detectamos el ancho de la tarjeta dinámicamente para que funcione en móvil y PC
      // Si no puedes detectarlo, mantén tu 420 (380 + 40 gap)
      const anchoTarjeta = elemento.querySelector('.car-card')?.clientWidth || 380;
      const gap = 40;
      const distanciaMovimiento = anchoTarjeta + gap;

      const scrollMaximo = elemento.scrollWidth - elemento.clientWidth;
      const posicionActual = elemento.scrollLeft;

      // --- CORRECCIÓN DE LÓGICA ---

      if (direccion === 1 && posicionActual >= scrollMaximo - 10) {
        // Caso: Final -> Inicio
        elemento.scrollTo({ left: 0, behavior: 'smooth' });
      } else if (direccion === -1 && posicionActual <= 10) {
        // Caso: Inicio -> Final
        elemento.scrollTo({ left: scrollMaximo, behavior: 'smooth' });
      } else {
        // Caso normal: Calculamos la nueva posición exacta
        // Usar scrollTo en lugar de scrollBy evita acumulaciones de error
        const nuevaPosicion = posicionActual + distanciaMovimiento * direccion;
        elemento.scrollTo({ left: nuevaPosicion, behavior: 'smooth' });
      }
    }
  }

  showDetails(id: number) {
    // Codificamos el ID a Base64
    const encodedId = btoa(id.toString());
    this.router.navigate(['/detail-car', encodedId]);
  }
}
