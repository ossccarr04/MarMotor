import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, inject, Inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CarDTO } from '../../../../@types/interface/car.interface';
import { CarServiceBBDD } from '../../../services/car-service-bbdd';
import { BadgeLabel, BadgeType } from '../../../../@types/enums/badge.enum';
import { FavoriteServiceBBDD } from '../../../services/favorite-service-bbdd';
import { AuthServiceBBDD } from '../../../services/auth-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-galery-dynamic',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './galery-dynamic.html',
  styleUrl: './galery-dynamic.scss',
})
export class GaleryDynamic {
  private carservice = inject(CarServiceBBDD);
  private cdr = inject(ChangeDetectorRef);
  private favoriteService = inject(FavoriteServiceBBDD);
  private router = inject(Router);
  private authService = inject(AuthServiceBBDD);
  private toast = inject(ToastrService);

  @ViewChild('carrusel') carrusel!: ElementRef;

  BadgeType = BadgeType;
  badgeLabel = BadgeLabel;
  filtroSeleccionado: BadgeType = BadgeType.NONE;
  public cargando = true;
  cochesOriginal: CarDTO[] = [];
  coches: CarDTO[] = [];
  cochesFiltradoDetail: CarDTO[] = [];
  private misFavoritosIds: number[] = [];

  ngOnInit(): void {
    this.cargarFavoritosYCoches();
  }

  private cargarFavoritosYCoches(): void {
    if (this.authService.isLoggedIn()) {
      this.favoriteService.getMyFavorites().subscribe({
        next: (favs) => {
          this.misFavoritosIds = favs.map((c) => c.id);
          this.cargarCochesGaleria();
        },
        error: () => {
          this.misFavoritosIds = [];
          this.cargarCochesGaleria();
        },
      });
    } else {
      this.misFavoritosIds = [];
      this.cargarCochesGaleria();
    }
  }

  private aplicarEstadoFavoritos(coches: CarDTO[]): CarDTO[] {
    return coches.map((coche) => ({ ...coche, isSaved: this.misFavoritosIds.includes(coche.id) }));
  }

  private cargarCochesGaleria(): void {
    this.carservice.getCars().subscribe({
      next: (data) => {
        const SOLD_UPPER = this.BadgeType.SOLD.toUpperCase();
        const RESERVED_UPPER = this.BadgeType.RESERVED.toUpperCase();

        const dataConFavoritos = this.aplicarEstadoFavoritos(data);
        this.cochesOriginal = dataConFavoritos;

        // Por defecto, mostrar todos los coches que NO estén vendidos ni reservados
        const cochesDisponiblesInicial = this.cochesOriginal.filter((c) => {
          const processedBadge = c.badge ? String(c.badge).trim().toUpperCase() : 'NONE';
          return processedBadge !== SOLD_UPPER && processedBadge !== RESERVED_UPPER;
        });
        this.coches = cochesDisponiblesInicial.slice(0, 10);

        this.cochesFiltradoDetail = [...this.coches];
        this.cdr.detectChanges();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error de conexión o de API:', err);
        this.cargando = false;
      },
    });
  }

  getBadgeText(badge: any): string {
    if (!badge) return '';

    const badgeKey = badge ? (String(badge).trim().toLowerCase() as BadgeType) : BadgeType.NONE;

    if (Object.values(this.BadgeType).includes(badgeKey)) {
      return this.badgeLabel[badgeKey as BadgeType];
    }
    return badge ? badge.toString() : '';
  }

  toggleGuardar(coche: CarDTO, event: Event) {
    event.stopPropagation();

    if (!this.authService.isLoggedIn()) {
      this.toast.info('Debes iniciar sesión para guardar favoritos', 'Acción requerida');
      return;
    }

    const estadoAnterior = coche.isSaved;

    // 1. Actualización optimista de la UI
    coche.isSaved = !estadoAnterior;
    this.cdr.detectChanges();

    const peticion = estadoAnterior
      ? this.favoriteService.removeFavorite(coche.id)
      : this.favoriteService.addFavorite(coche.id);

    peticion.subscribe({
      // 2. En caso de éxito, no hacemos nada.
      next: () => {
        if (estadoAnterior) {
          this.misFavoritosIds = this.misFavoritosIds.filter((id) => id !== coche.id);
        } else {
          this.misFavoritosIds.push(coche.id);
        }
      },
      // 3. En caso de error, revertimos el cambio y notificamos.
      error: (err) => {
        console.error(
          estadoAnterior ? 'Error al eliminar de favoritos:' : 'Error al guardar en favoritos:',
          err,
        );
        coche.isSaved = estadoAnterior;
        this.cdr.detectChanges();
        this.toast.error(
          'No se pudo completar la acción. Por favor, inténtalo de nuevo.',
          'Error de conexión',
        );
      },
    });
  }

  moverCarrusel(direccion: number) {
    if (this.carrusel) {
      const elemento = this.carrusel.nativeElement;

      const tarjeta = elemento.querySelector('.car-card');
      const anchoTarjeta = tarjeta?.clientWidth || 320;

      const estiloDinamico = window.getComputedStyle(elemento);
      const gap = parseInt(estiloDinamico.gap) || 20;

      const distanciaMovimiento = anchoTarjeta + gap;
      const scrollMaximo = elemento.scrollWidth - elemento.clientWidth;
      const posicionActual = elemento.scrollLeft;

      // --- LÓGICA DE INFINITO Y MOVIMIENTO ---
      if (direccion === 1 && posicionActual >= scrollMaximo - 10) {
        elemento.scrollTo({ left: 0, behavior: 'smooth' });
      } else if (direccion === -1 && posicionActual <= 10) {
        elemento.scrollTo({ left: scrollMaximo, behavior: 'smooth' });
      } else {
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

      this.isAtStart = scrollLeft <= 5;
      this.isAtEnd = scrollLeft >= scrollMax - 5;
    }
  }

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
    el.style.scrollBehavior = 'auto';
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
      this.startX = e.pageX - el.offsetLeft;
      this.scrollLeftStart = 0;
      el.scrollLeft = 0;
    } else if (nuevaPosicion < -100) {
      this.startX = e.pageX - el.offsetLeft;
      this.scrollLeftStart = scrollMaximo;
      el.scrollLeft = scrollMaximo;
    } else {
      const prevScrollLeft = el.scrollLeft;
      el.scrollLeft = nuevaPosicion;
      this.velocity = el.scrollLeft - prevScrollLeft;
    }
  }

  onMouseUp() {
    this.isDragging = false;
    const el = this.carrusel.nativeElement;
    el.style.cursor = 'grab';

    this.applyInertia();
  }

  private applyInertia() {
    const el = this.carrusel.nativeElement;

    if (Math.abs(this.velocity) > 0.5) {
      el.scrollLeft += this.velocity;
      this.velocity *= 0.95;
      this.rafId = requestAnimationFrame(() => this.applyInertia());
    } else {
      el.style.scrollBehavior = 'smooth';
    }
  }

  setFiltro(tipo: BadgeType) {
    const elemento = this.carrusel.nativeElement;

    this.filtroSeleccionado = tipo;
    // Paso 1: Filtrar siempre los coches que NO estén vendidos ni reservados de la lista original
    const cochesDisponibles = this.cochesOriginal.filter((c) => {
      const processedBadge = c.badge ? String(c.badge).trim().toUpperCase() : 'NONE';
      const SOLD_UPPER = this.BadgeType.SOLD.toUpperCase();
      const RESERVED_UPPER = this.BadgeType.RESERVED.toUpperCase();
      return processedBadge !== SOLD_UPPER && processedBadge !== RESERVED_UPPER;
    });

    if (tipo === BadgeType.NONE) {
      // Si el filtro es NONE, mostramos los primeros 10 coches disponibles
      this.coches = cochesDisponibles.slice(0, 10);
    } else {
      this.coches = cochesDisponibles.filter(
        (c) => c.badge && String(c.badge).trim().toUpperCase() === tipo.toUpperCase(),
      );
    }
    this.cochesFiltradoDetail = this.coches;
    elemento.scrollTo({ left: 0, behavior: 'smooth' });
  }

  showDetails(id: number) {
    const encodedId = btoa(id.toString());
    this.router.navigate(['/detail-car', encodedId], {
      state: { listaFiltrada: this.cochesFiltradoDetail },
    });
  }
}
