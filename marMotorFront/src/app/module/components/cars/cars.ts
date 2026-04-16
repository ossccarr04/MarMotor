import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import { CarServiceBBDD } from '../../services/car-service-bbdd';
import { Filters } from '../common/filters/filters';
import { ActivatedRoute, Router } from '@angular/router';
import { CarDTO } from '../../../@types/interface/car.interface';
import { ToastrService } from 'ngx-toastr';
import { BadgeLabel, BadgeType } from '../../../@types/enums/badge.enum';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule, Filters],
  templateUrl: './cars.html',
  styleUrl: './cars.scss',
})
export class Cars {
  @ViewChild(Filters) filtroComponent!: Filters;

  private carService = inject(CarServiceBBDD);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastrService);
  private quiereVendidos = this.carService.mantenerVendidosActivo;

  public cargando: boolean = false;
  badgeLabel = BadgeLabel;
  badgeType = BadgeType;
  filtrosSeleccionados: any = {};
  cochesFiltrados: CarDTO[] = [];
  cochesVisibles: CarDTO[] = [];
  paginaActual = 1;
  itemsPorPagina = 12;

  ngOnInit() {

    this.carService.recargarCoches$.subscribe(() => {
      const params = this.route.snapshot.queryParams;
      if (params && Object.keys(params).length > 0) {
        this.filtrosSeleccionados = { ...params };
        this.cargarCoches(params);
        window.scrollTo({ top: 600, behavior: 'smooth' });
      } else {
        this.filtrosSeleccionados = {};
        this.cargarCoches({});
      }
    });

    this.route.queryParams.subscribe((params) => {
      this.cargarCoches(params);
    });
  }

  getBadgeText(badge: any): string {
    if (!badge) return '';
    const key = badge.toString().toUpperCase() as keyof typeof BadgeType;
    const badgeValue = BadgeType[key];
    return badgeValue ? this.badgeLabel[badgeValue] : badge.toString();
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
          this.cochesFiltrados = aplicarFiltroVendidos(data);
          
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
        this.cochesFiltrados = aplicarFiltroVendidos(data);
       
        this.carService.setCarIds(this.cochesFiltrados.map((c) => c.id));

        if (this.cochesFiltrados.length === 0 && this.cargando) {
          if(filtrosLimpios){
            this.toast.warning('No se han encontrado vehículos', 'Atención');
          }
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

    // 4. LÓGICA DE FILTROS NORMALES (Desplegables)

    this.carService.getCarsByFilters(filtrosLimpios).subscribe({
      next: (data) => {
        this.cochesFiltrados = aplicarFiltroVendidos(data);
        
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
        this.cargarCoches(params);
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
    if (this.filtroComponent) {
      this.filtroComponent.limpiarMarca();
      this.filtroComponent.limpiarCarroceria();
      this.filtroComponent.limpiarCombustible();
      this.filtroComponent.precioActual = 0;
      this.filtroComponent.precioModificado = false;
      this.filtroComponent.busquedaAdmin = '';
    }

    // 2. Navegamos a la ruta limpia (esto resetea los coches en pantalla)
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });

    this.paginaActual = 1;
  }

  toggleGuardar(coche: any, event: Event) {
    event.stopPropagation();
    coche.isSaved = !coche.isSaved;
    this.cdr.detectChanges();
  }

  showDetails(id: number) {
    const encodedId = btoa(id.toString());
    this.router.navigate(['/detail-car', encodedId], {
      state: { listaFiltrada: this.cochesFiltrados },
    });
  }
}
