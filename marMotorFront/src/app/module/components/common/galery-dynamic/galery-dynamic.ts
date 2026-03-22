import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CarDTO } from '../../../../@types/interface/car.interface';


@Component({
  selector: 'app-galery-dynamic',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './galery-dynamic.html',
  styleUrl: './galery-dynamic.scss',
})
export class GaleryDynamic {
  private router = inject(Router);

  @ViewChild('carrusel') carrusel!: ElementRef;

  coches: CarDTO[] = [
    {
      id: 1,
      make: 'TESLA',
      model: 'MODEL Y',
      year: 2023,
      price: 48500,
      imageUrl: 'assets/tesla_model_y.jpg',
      fuelType: 'Electric',
      transmission: 'Automatic',
      power: 299,
      mileage: 324,
      consumption: '3.5%',
      badge: 'FEATURED',
      badgeType: 'featured',
      isSaved: false,
    },
    {
      id: 2,
      make: 'SEAT',
      model: 'ATECA',
      year: 2022,
      price: 28500,
      imageUrl: 'assets/car1.jpg',
      fuelType: 'Petrol',
      transmission: 'Manual',
      power: 150,
      mileage: 15400,
      consumption: '3.5%',
      badge: 'NEW',
      badgeType: 'new',
      isSaved: false,
    },
    {
      id: 3,
      make: 'AUDI',
      model: 'Q4 E-TRON',
      year: 2024,
      price: 52000,
      imageUrl: 'assets/car1.png',
      fuelType: 'Electric',
      transmission: 'Automatic',
      power: 204,
      mileage: 400,
      consumption: '3.1%',
      badge: null,
      badgeType: null,
      isSaved: true,
    },
    {
      id: 4,
      make: 'TESLA',
      model: 'MODEL Y (Long Range)',
      year: 2023,
      price: 54000,
      imageUrl: 'assets/tesla_model_y.jpg',
      fuelType: 'Electric',
      transmission: 'Automatic',
      power: 350,
      mileage: 1200,
      consumption: '3.5%',
      badge: 'FEATURED',
      badgeType: 'featured',
      isSaved: false,
    },
    {
      id: 5,
      make: 'TESLA',
      model: 'MODEL Y (Performance)',
      year: 2024,
      price: 59900,
      imageUrl: 'assets/tesla_model_y.jpg',
      fuelType: 'Electric',
      transmission: 'Automatic',
      power: 512,
      mileage: 50,
      consumption: '3.5%',
      badge: 'NEW',
      badgeType: 'new',
      isSaved: false,
    },
    {
      id: 6,
      make: 'TESLA',
      model: 'MODEL Y',
      year: 2022,
      price: 45000,
      imageUrl: 'assets/tesla_model_y.jpg',
      fuelType: 'Electric',
      transmission: 'Automatic',
      power: 299,
      mileage: 25000,
      consumption: '3.5%',
      badge: 'FEATURED',
      badgeType: 'featured',
      isSaved: false,
    },
    {
      id: 7,
      make: 'TESLA',
      model: 'MODEL Y',
      year: 2023,
      price: 48500,
      imageUrl: 'assets/tesla_model_y.jpg',
      fuelType: 'Electric',
      transmission: 'Automatic',
      power: 299,
      mileage: 100,
      consumption: '3.5%',
      badge: 'FEATURED',
      badgeType: 'featured',
      isSaved: false,
    },
    {
      id: 8,
      make: 'TESLA',
      model: 'MODEL Y',
      year: 2023,
      price: 47900,
      imageUrl: 'assets/tesla_model_y.jpg',
      fuelType: 'Electric',
      transmission: 'Automatic',
      power: 299,
      mileage: 5000,
      consumption: '3.5%',
      badge: null,
      badgeType: null,
      isSaved: false,
    },
    {
      id: 9,
      make: 'TESLA',
      model: 'MODEL Y',
      year: 2024,
      price: 49500,
      imageUrl: 'assets/tesla_model_y.jpg',
      fuelType: 'Electric',
      transmission: 'Automatic',
      power: 299,
      mileage: 10,
      consumption: '3.5%',
      badge: 'NEW',
      badgeType: 'new',
      isSaved: false,
    },
    {
      id: 10,
      make: 'TESLA',
      model: 'MODEL Y',
      year: 2023,
      price: 48500,
      imageUrl: 'assets/tesla_model_y.jpg',
      fuelType: 'Electric',
      transmission: 'Automatic',
      power: 299,
      mileage: 324,
      consumption: '3.5%',
      badge: 'FEATURED',
      badgeType: 'featured',
      isSaved: false,
    },
  ] as CarDTO[];

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
