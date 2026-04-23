import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CarServiceBBDD } from '../../services/car-service-bbdd';
import { Filters } from '../common/filters/filters';
import { ActivatedRoute, Router } from '@angular/router';
import { CarDTO } from '../../../@types/interface/car.interface';
import { ToastrService } from 'ngx-toastr';
import { BadgeLabel, BadgeType } from '../../../@types/enums/badge.enum';
import { FavoriteServiceBBDD } from '../../services/favorite-service-bbdd';
import { AuthServiceBBDD } from '../../services/auth-service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule, Filters],
  templateUrl: './cars.html',
  styleUrl: './cars.scss',
})
export class Cars implements OnInit, OnDestroy {
  
  @ViewChild(Filters) filtroComponent!: Filters;

  private carService = inject(CarServiceBBDD);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastrService);
  private favoriteService = inject(FavoriteServiceBBDD);
  private authService = inject(AuthServiceBBDD);
  private quiereVendidos = this.carService.mantenerVendidosActivo;

  public cargando: boolean = false;
  badgeLabel = BadgeLabel;
  badgeType = BadgeType;
  filtrosSeleccionados: any = {};
  cochesFiltrados: CarDTO[] = [];
  cochesVisibles: CarDTO[] = [];
  paginaActual = 1;
  itemsPorPagina = 12;

  private misFavoritosIds: number[] = [];
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    // Combina la carga de favoritos y la carga de coches basada en los parámetros de la URL.
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.filtrosSeleccionados = { ...params };
      this.cargarFavoritosYCoches(params);
    });

    // Escucha el evento de recarga desde el interruptor "Vendidos" en Filters.
    this.carService.recargarCoches$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      // Si hay filtros en la URL, navegamos para limpiarla.
      // Esta navegación disparará el `queryParams.subscribe` de arriba, que recargará los coches.
      if (Object.keys(this.route.snapshot.queryParams).length > 0) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {},
        });
      } else {
        // Si la URL ya está limpia, la navegación no haría nada.
        // Forzamos la recarga de coches manualmente para evitar el fallo.
        this.cargarFavoritosYCoches({});
      }
    });
  }

  ngOnDestroy(): void {
    // Este método se ejecuta cuando el componente se destruye.
    // Enviamos una señal para que todas las suscripciones activas (con takeUntil)
    // se cancelen automáticamente, evitando fugas de memoria.
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Carga primero los IDs de los coches favoritos del usuario (si está logueado)
   * y luego procede a cargar la lista de coches aplicando esos favoritos.
   */
  private cargarFavoritosYCoches(params: any): void {
    if (this.authService.isLoggedIn()) {
      this.favoriteService.getMyFavorites().subscribe({
        next: (favs) => {
          this.misFavoritosIds = favs.map(c => c.id);
          this.cargarCoches(params); // Carga coches después de tener los favoritos
        },
        error: () => {
          this.misFavoritosIds = []; // En caso de error, lista de favoritos vacía
          this.cargarCoches(params); // Aún así cargamos los coches
        }
      });
    } else {
      this.misFavoritosIds = []; // Usuario no logueado, no hay favoritos
      this.cargarCoches(params);
    }
  }

  getBadgeText(badge: any): string {
    if (!badge) return '';
    const key = badge.toString().toUpperCase() as keyof typeof BadgeType;
    const badgeValue = BadgeType[key];
    return badgeValue ? this.badgeLabel[badgeValue] : badge.toString();
  }

  /**
   * Mapea la lista de coches para marcar cuáles son favoritos.
   * @param coches La lista de coches a mapear.
   * @returns La lista de coches con el estado `isSaved` actualizado.
   */
  private aplicarEstadoFavoritos(coches: CarDTO[]): CarDTO[] {
    return coches.map(coche => ({ ...coche, isSaved: this.misFavoritosIds.includes(coche.id) }));
  }

  cargarCoches(filtrosNuevos: any = {}) {
    this.cargando = true;
    this.cochesFiltrados = [];
    // 1. LA ÚNICA REGLA: ¿Qué dice el interruptor de Admin ahora mismo?
    const quiereVerVendidos = this.carService.mantenerVendidosActivo;

    // 2. Decodificamos TODOS los filtros UNA SOLA VEZ
    const filtrosLimpios: any = {};
    Object.keys(filtrosNuevos).forEach((key) => {
      const valor = filtrosNuevos[key];
      if (valor !== 'all' && valor !== null && valor !== undefined && valor !== '') {
        filtrosLimpios[atob(key)] = atob(valor);
      }
    });

    // --- FUNCIÓN AUXILIAR (Totalmente limpia de rutas) ---
    const aplicarFiltroVendidos = (data: any[]) => {
      // Guardamos la palabra exacta en mayúsculas ("SOLD")
      const VALOR_VENDIDO = String(this.badgeType.SOLD).toUpperCase();

      return (data || []).filter((coche) => {
        const badgeSeguro = coche.badge ? coche.badge.trim().toUpperCase() : 'NONE';
        return quiereVerVendidos ? badgeSeguro === VALOR_VENDIDO : badgeSeguro !== VALOR_VENDIDO;
      });
    };

    // 3. LÓGICA DE BÚSQUEDA RÁPIDA (Search por texto)

    if (filtrosLimpios['search']) {
      const queryTerm = filtrosLimpios['search'];

      this.carService.getCarsByModel(queryTerm).subscribe({
        next: (data) => {
          const dataConFavoritos = this.aplicarEstadoFavoritos(data);
          this.cochesFiltrados = aplicarFiltroVendidos(dataConFavoritos);

          this.carService.setCarIds(this.cochesFiltrados.map((c) => c.id));

          if (this.cochesFiltrados.length === 0 && this.cargando) {
            const mensaje = quiereVerVendidos
              ? 'No se han encontrado vehículos vendidos con ese modelo/marca'
              : 'No se han encontrado vehículos disponibles con ese modelo/marca';
            this.toast.warning(mensaje, 'Atención');
          }
          this.cargando = false;
          this.paginaActual = 1;
          this.actualizarVista();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error en búsqueda admin:', err);
          this.cargando = false;
        },
      });

      return; // Salimos de la función
    }

    // 4. LÓGICA DE FILTROS NORMALES (Desplegables)
    this.carService.getCarsByFilters(filtrosLimpios).subscribe({
      next: (data) => {
        const dataConFavoritos = this.aplicarEstadoFavoritos(data);
        this.cochesFiltrados = aplicarFiltroVendidos(dataConFavoritos);

        this.carService.setCarIds(this.cochesFiltrados.map((c) => c.id));

        if (this.cochesFiltrados.length === 0 && this.cargando) {
          const mensaje = quiereVerVendidos
            ? 'No se han encontrado vehículos vendidos con esos filtros'
            : 'No se han encontrado vehículos disponibles con esos filtros';
          this.toast.warning(mensaje, 'Atención');
        }
        this.cargando = false;
        this.paginaActual = 1;
        this.actualizarVista();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error con los filtros:', err);
        this.cargando = false;
      },
    });
  }

  alCambiarInterruptor() {
    this.carService.mantenerVendidosActivo = this.quiereVendidos;

    this.route.queryParams
      .subscribe((params) => {
        this.cargarFavoritosYCoches(params);
      })
      .unsubscribe(); // Nos desuscribimos al instante para que no se quede escuchando
  }

  // Este método recibe los cambios del componente Filters
  aplicarFiltros(filtrosNuevos: any) {
    // 5. Al navegar a la misma URL con los nuevos filtros, el subscribe del ngOnInit
    // se activará solo, ejecutando cargarCoches() automáticamente.
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: filtrosNuevos,
      queryParamsHandling: 'merge',
    });
  }

  actualizarVista() {
    const limite = this.paginaActual * this.itemsPorPagina;
    this.cochesVisibles = this.cochesFiltrados.slice(0, limite);
  }

  mostrarMas() {
    this.paginaActual++;
    this.actualizarVista();
    this.cdr.detectChanges();
  }

  get tieneMasCoches(): boolean {
    return this.cochesVisibles.length < this.cochesFiltrados.length;
  }

  ordenarCoches(event: any) {
    const criterio = event.target.value;

    switch (criterio) {
      case 'priceAsc':
        this.cochesFiltrados.sort((a, b) => a.price - b.price);
        break;
      case 'priceDesc':
        this.cochesFiltrados.sort((a, b) => b.price - a.price);
        break;
      case 'brand':
        this.cochesFiltrados.sort((a, b) => a.make.localeCompare(b.make));
        break;
      case 'power':
        this.cochesFiltrados.sort((a, b) => b.power - a.power);
        break;
      case 'year':
        this.cochesFiltrados.sort((a, b) => b.year - a.year);
        break;
      case 'km':
        this.cochesFiltrados.sort((a, b) => a.mileage - b.mileage);
        break;
      case 'kmDesc':
        this.cochesFiltrados.sort((a, b) => b.mileage - a.mileage);
        break;
      default:
        // Aquí podrías volver al orden original si guardaste una copia
        break;
    }

    // Reiniciamos la paginación para mostrar los primeros resultados del nuevo orden
    this.paginaActual = 1;
    this.actualizarVista(); // El método que recorta los coches que se ven
  }

  resetFilters() {
    
      this.filtroComponent.limpiarMarca();
      this.filtroComponent.limpiarCarroceria();
      this.filtroComponent.limpiarCombustible();
      this.filtroComponent.precioActual = 0;
      this.filtroComponent.precioModificado = false;
      this.filtroComponent.busquedaAdmin = '';
    

    // 2. Navegamos a la ruta limpia (esto resetea los coches en pantalla)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });

    this.paginaActual = 1;
  }

  toggleGuardar(coche: CarDTO, event: Event) {
    event.stopPropagation();

    if (!this.authService.isLoggedIn()) {
      this.toast.info('Debes iniciar sesión para guardar favoritos', 'Acción requerida');
      this.router.navigate(['/login']);
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
      // 2. En caso de éxito, no hacemos nada porque la UI ya está actualizada.
      next: () => {
        // Opcional: Toast de éxito silencioso.
        // Actualizamos nuestra lista de IDs localmente para consistencia
        if (estadoAnterior) {
          this.misFavoritosIds = this.misFavoritosIds.filter(id => id !== coche.id);
        } else {
          this.misFavoritosIds.push(coche.id);
        }
      },
      // 3. En caso de error, revertimos el cambio en la UI y notificamos al usuario.
      error: (err) => {
        console.error(estadoAnterior ? 'Error al eliminar:' : 'Error al guardar:', err);
        coche.isSaved = estadoAnterior; // Revertimos al estado original
        this.cdr.detectChanges();
        this.toast.error(
          'No se pudo completar la acción. Por favor, inténtalo de nuevo.',
          'Error de conexión'
        );
      },
    });
  }

  showDetails(id: number) {
    const encodedId = btoa(id.toString());
    this.router.navigate(['/detail-car', encodedId], {
      state: { listaFiltrada: this.cochesFiltrados },
    });
  }
}
