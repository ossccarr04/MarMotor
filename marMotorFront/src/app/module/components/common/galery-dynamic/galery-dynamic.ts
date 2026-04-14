import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, Inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CarDTO } from '../../../../@types/interface/car.interface';
import { CarServiceBBDD } from '../../../services/car-service-bbdd';
import { BadgeLabel, BadgeType } from '../../../../@types/enums/badge.enum';

@Component({
  selector: 'app-galery-dynamic',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './galery-dynamic.html',
  styleUrl: './galery-dynamic.scss',
})
export class GaleryDynamic {
  private carservice = inject(CarServiceBBDD);
  private router = inject(Router);

  @ViewChild('carrusel') carrusel!: ElementRef;

  BadgeType = BadgeType;
  badgeLabel= BadgeLabel
  filtroSeleccionado: BadgeType = BadgeType.NONE;
  cochesOriginal: CarDTO[] = [];
  coches: CarDTO[] = [];
  cochesFiltradoDetail: CarDTO[] = [];

  ngOnInit(): void {
    this.carservice.getCars().subscribe({
      next: (data) => {
        this.cochesOriginal = data;

        this.coches = data
          .filter((c) => c.badge && c.badge.trim() !== '') // Solo con etiqueta
          .slice(0, 10); // Máximo 10

        this.cochesFiltradoDetail = [...this.coches];
      },
      error: (err) => {
        console.error('Error de conexión o de API:', err);
      },
    });
  }

    getBadgeText(badge: any): string {
    if (!badge) return '';
    const key = badge.toString().toUpperCase() as keyof typeof BadgeType;
    const badgeValue = BadgeType[key];
    return badgeValue ? this.badgeLabel[badgeValue] : badge.toString();
  }

  toggleGuardar(coche: CarDTO) {
    coche.isSaved = !coche.isSaved;
  }

  moverCarrusel(direccion: number) {
    if (this.carrusel) {
      const elemento = this.carrusel.nativeElement;

      // 1. Detectamos el ancho de la tarjeta y el GAP real del CSS
      const tarjeta = elemento.querySelector('.car-card');
      const anchoTarjeta = tarjeta?.clientWidth || 320;

      // Obtenemos el gap real configurado en el SCSS (grid-gap o gap)
      const estiloDinamico = window.getComputedStyle(elemento);
      const gap = parseInt(estiloDinamico.gap) || 20;

      const distanciaMovimiento = anchoTarjeta + gap;
      const scrollMaximo = elemento.scrollWidth - elemento.clientWidth;
      const posicionActual = elemento.scrollLeft;

      // --- LÓGICA DE INFINITO Y MOVIMIENTO ---
      if (direccion === 1 && posicionActual >= scrollMaximo - 10) {
        // Final -> Inicio
        elemento.scrollTo({ left: 0, behavior: 'smooth' });
      } else if (direccion === -1 && posicionActual <= 10) {
        // Inicio -> Final
        elemento.scrollTo({ left: scrollMaximo, behavior: 'smooth' });
      } else {
        // Movimiento normal
        // Redondeamos para evitar problemas con decimales en zooms de pantalla
        const nuevaPosicion = Math.round(posicionActual + distanciaMovimiento * direccion);
        elemento.scrollTo({ left: nuevaPosicion, behavior: 'smooth' });
      }
    }
  }

  isAtStart: boolean = true;
  isAtEnd: boolean = false;

  onScrollCheck() {
    if (this.carrusel) {
      const el = this.carrusel.nativeElement;
      const scrollLeft = el.scrollLeft;
      const scrollMax = el.scrollWidth - el.clientWidth;

      // Margen de 5px para evitar errores de redondeo en navegadores
      this.isAtStart = scrollLeft <= 5;
      this.isAtEnd = scrollLeft >= scrollMax - 5;
    }
  }

  // Variables para controlar el estado del arrastre
isDragging = false;
startX: number = 0;
scrollLeftStart = 0;
velocity = 0;
rafId: number | null = null;

onMouseDown(e: MouseEvent) {
  this.isDragging = true;
  const el = this.carrusel.nativeElement;
  
  // Guardamos posición inicial
  this.startX = e.pageX - el.offsetLeft;
  this.scrollLeftStart = el.scrollLeft;
  
  // Preparamos el elemento
  el.style.scrollBehavior = 'auto'; // El drag debe ser 'auto' para ser fluido
  el.style.cursor = 'grabbing';
  
  // Cancelamos cualquier animación previa si el usuario hace clic mientras se mueve
  if (this.rafId) cancelAnimationFrame(this.rafId);
}


onMouseMove(e: MouseEvent) {
  if (!this.isDragging) return;
  e.preventDefault();
  
  const el = this.carrusel.nativeElement;
  const x = e.pageX - el.offsetLeft;
  const walk = (x - this.startX) * 1.5; 
  
  const scrollMaximo = el.scrollWidth - el.clientWidth;
  const nuevaPosicion = this.scrollLeftStart - walk;

  // --- LÓGICA DE BUCLE INFINITO AL ARRASTRAR ---
  
  if (nuevaPosicion > scrollMaximo + 100) { 
    // Si arrastramos más allá del final (+50px de margen) -> Salto al inicio
    this.startX = e.pageX - el.offsetLeft;
    this.scrollLeftStart = 0;
    el.scrollLeft = 0;
  } else if (nuevaPosicion < -100) {
    // Si arrastramos más allá del inicio (-50px de margen) -> Salto al final
    this.startX = e.pageX - el.offsetLeft;
    this.scrollLeftStart = scrollMaximo;
    el.scrollLeft = scrollMaximo;
  } else {
    // Movimiento normal
    const prevScrollLeft = el.scrollLeft;
    el.scrollLeft = nuevaPosicion;
    this.velocity = el.scrollLeft - prevScrollLeft;
  }
}

onMouseUp() {
  this.isDragging = false;
  const el = this.carrusel.nativeElement;
  el.style.cursor = 'grab';
  
  // Iniciamos la inercia (el movimiento extra al soltar)
  this.applyInertia();
}

private applyInertia() {
  const el = this.carrusel.nativeElement;
  
  if (Math.abs(this.velocity) > 0.5) {
    el.scrollLeft += this.velocity;
    this.velocity *= 0.95; // Rozamiento (va frenando poco a poco)
    this.rafId = requestAnimationFrame(() => this.applyInertia());
  } else {
    // Cuando se detiene, reactivamos el smooth para los botones
    el.style.scrollBehavior = 'smooth';
  }
}

  setFiltro(tipo: BadgeType) {
    const elemento = this.carrusel.nativeElement;

    this.filtroSeleccionado = tipo;
    if (tipo === BadgeType.NONE) {
      this.coches = [...this.cochesOriginal];
    } else {
      this.coches = this.cochesOriginal.filter(
        (c) =>
          c.badge &&
          c.badge.charAt(0).toUpperCase() + c.badge.slice(1).toLowerCase() ===
            tipo.charAt(0).toUpperCase() + tipo.slice(1).toLowerCase(),
      );
    }
    this.cochesFiltradoDetail = this.coches;
    elemento.scrollTo({ left: 0, behavior: 'smooth' });
  }

  showDetails(id: number) {
    // Codificamos el ID a Base64
    const encodedId = btoa(id.toString());
    this.router.navigate(['/detail-car', encodedId], {
      state: { listaFiltrada: this.cochesFiltradoDetail },
    });
  }
}
