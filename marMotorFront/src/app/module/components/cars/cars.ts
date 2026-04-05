import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { CarServiceBBDD } from '../../services/car-service-bbdd';
import { Filters } from '../common/filters/filters';
import { ActivatedRoute, Router } from '@angular/router';
import { CarDTO } from '../../../@types/interface/car.interface';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [CommonModule, Filters],
  templateUrl: './cars.html',
  styleUrl: './cars.scss',
})
export class Cars {
  private carService = inject(CarServiceBBDD);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  filtrosSeleccionados: any = {};
  cochesFiltrados: CarDTO[] = [];
  cochesVisibles: CarDTO[] = [];
  paginaActual = 1;
  itemsPorPagina = 12;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
    if (Object.keys(params).length > 0) {
      
      this.filtrosSeleccionados = { ...params };
      
      this.cargarCoches(params);
      window.scrollTo({ top: 600, behavior: 'smooth' });
      
    } else {
      // Si no hay parámetros (vengo de un menú directo), cargamos todo
      this.cargarCoches({});
    }
  });
  }

  cargarCoches(filtrosNuevos: any = {}) {
    // Creamos una copia limpia de los filtros
    const filtrosLimpios: any = {};

    Object.keys(filtrosNuevos).forEach((key) => {
      const valor = filtrosNuevos[key];

      if (valor !== 'all' && valor !== null && valor !== undefined && valor !== '') {
        filtrosLimpios[atob(key)] = atob(valor);
      }
    });

    this.carService.getCarsByFilters(filtrosLimpios).subscribe({
      next: (data) => {
        this.cochesFiltrados = data || [];
        this.paginaActual = 1;
        this.actualizarVista();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
      },
    });
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

  resetFilters() {
    // Navegamos a la ruta limpia, lo que disparará cargarCoches con {}
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
