import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  PLATFORM_ID,
  ViewChild,
  OnInit,
  inject,
  ChangeDetectorRef,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BrandDTO } from '../../../../@types/interface/brand.interface';
import { BrandServiceBBDD } from '../../../services/brand-service-bbdd';
import { FuelTypeServiceBBDD } from '../../../services/fuel-service-bbdd';
import { BodyTypeDTO } from '../../../../@types/interface/bodyType.interface';
import { FuelDTO } from '../../../../@types/interface/fuel.interface';
import { BodyTypeServiceBBDD } from '../../../services/bodyType-service-bbdd';
import { CarServiceBBDD } from '../../../services/car-service-bbdd';
import { ToastrService } from 'ngx-toastr';
import { CarDTO } from '../../../../@types/interface/car.interface';
import { AuthServiceBBDD } from '../../../services/auth-service';
import { UserRoles } from '../../../../@types/enums/roles.enums';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
})
export class Filters implements OnInit {
  @Input() cargando: boolean = false;
  @Input() limiteMarcas: number = 10;

  @Input() set initialFilters(value: any) {
    // Protección para evitar ejecutar lógica de decodificación en el servidor
    if (value && isPlatformBrowser(this.platformId)) {
      try {
        const brands = value[btoa('brand')] ? atob(value[btoa('brand')]).split(',') : [];
        const bodies = value[btoa('bodyType')] ? atob(value[btoa('bodyType')]).split(',') : [];
        const fuels = value[btoa('fuelType')] ? atob(value[btoa('fuelType')]).split(',') : [];
        const price = value[btoa('maxPrice')] ? atob(value[btoa('maxPrice')]) : null;

        if (brands.length > 0) brands.forEach(b => this.seleccionarMarcaPorNombre(b));
        if (bodies.length > 0) bodies.forEach(b => this.seleccionarCarroceriaPorNombre(b));
        if (fuels.length > 0) fuels.forEach(f => this.seleccionarCombustiblePorNombre(f));

        if (price) {
          this.precioActual = parseInt(price);
          this.precioModificado = true;
        }
      } catch (e) {
        console.error('Error decodificando filtros iniciales', e);
      }
    }
  }
  @Output() resultadosEncontrados = new EventEmitter<CarDTO[]>();
  @Output() filterChange = new EventEmitter<any>();

  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthServiceBBDD);
  private route = inject(Router);
  private carService = inject(CarServiceBBDD);
  private brandService = inject(BrandServiceBBDD);
  private bodyTypeService = inject(BodyTypeServiceBBDD);
  private fuelTypeService = inject(FuelTypeServiceBBDD);
  private platformId: Object = inject(PLATFORM_ID);

  marcas: BrandDTO[] = [];
  carrocerias: BodyTypeDTO[] = [];
  combustibles: FuelDTO[] = [];
  isModalMarcasOpen = false;
  terminoBusqueda = '';

  // Variables para el precio
  precioActual = 0;
  precioMin = 0;
  precioMax = 20000;
  precioModificado = false;
  circunferencia = 2 * Math.PI * 40;
  isDragging = false;
  busquedaAdmin: string = '';
  resultadosAdmin: any[] = [];
  isAdminV: boolean = false; 
  private internalLoading: boolean = true;
  private loadingCounter = 0;

  @ViewChild('sliderElement') sliderElement!: ElementRef;

  get isLoading(): boolean {
    // Si el padre manda el estado de carga (como en /cars), se respeta.
    // Si no (como en /home), usa su propio estado de carga interno.
    return this.cargando || this.internalLoading;
  }

  ngOnInit(): void {
    // Establecemos el contador de las llamadas asíncronas que haremos
    this.loadingCounter = 3; // 1 para marcas, 1 para carrocerías, 1 para combustibles

    this.isAdmin();
    this.limpiezaFiltros();
    // 1. Cargar Marcas
    this.cargarMarcasSegunEstado();
    // 2. Cargar Carrocerías (ahora dinámico)
    this.actualizarCarroceriasDinamicas();

    // 3. Cargar Combustibles
    this.actualizarCombustiblesDinamicos();
  }

  private checkLoadingComplete(): void {
    this.loadingCounter--;
    if (this.loadingCounter <= 0) {
      this.internalLoading = false;
      this.cdr.detectChanges();
    }
  }

  actualizarCombustiblesDinamicos() {
    const mostrarVendidos = this.carService.mantenerVendidosActivo;

    const combustiblesPreviamenteSeleccionados = this.combustibles.filter((f) => f.selected).map(f => f.name);

    this.fuelTypeService.getFuels(mostrarVendidos).subscribe({
      next: (data) => {
        this.combustibles = data.map((f: any) => ({
          ...f,
          name: f.name.toUpperCase(),
          selected: combustiblesPreviamenteSeleccionados.includes(f.name.toUpperCase()),
        }));
        const fuelFromUrl = this.getParamFromUrl('fuelType');
        if (fuelFromUrl) {
          fuelFromUrl.split(',').forEach(name => this.seleccionarCombustiblePorNombre(name));
        }
        this.cdr.detectChanges();
        this.checkLoadingComplete();
      },
      error: () => this.checkLoadingComplete(),
    });
  }

  actualizarCarroceriasDinamicas() {
    const mostrarVendidos = this.carService.mantenerVendidosActivo;
    const carroceriasPreviamenteSeleccionadas = this.carrocerias.filter((c) => c.selected).map(c => c.name);

    this.bodyTypeService.getBodyTypes(mostrarVendidos).subscribe({
      next: (data) => {
        this.carrocerias = data.map((c: any) => ({
          ...c,
          name: c.name.toUpperCase(),
          selected: carroceriasPreviamenteSeleccionadas.includes(c.name.toUpperCase()),
        }));
        const bodyFromUrl = this.getParamFromUrl('bodyType');
        if (bodyFromUrl) {
          bodyFromUrl.split(',').forEach(name => this.seleccionarCarroceriaPorNombre(name));
        }
        this.cdr.detectChanges();
        this.checkLoadingComplete();
      },
      error: () => this.checkLoadingComplete(),
    });
  }

  cargarMarcasSegunEstado() {
    // 1. Decidimos qué servicio llamar según el interruptor
    const mostrarVendidos = this.carService.mantenerVendidosActivo;

    const peticion = mostrarVendidos
      ? this.brandService.getBrandsSold()
      : this.brandService.getBrands();

    peticion.subscribe({
      next: (data) => {
        this.marcas = data;
        this.marcas.forEach((item) => {
          item.name = item.name.toUpperCase();
          item.selected = false;
        });

        // PROTECCIÓN SSR: Solo ejecutamos la selección por URL si hay marcas cargadas
        const brandFromUrl = this.getParamFromUrl('brand');
        if (brandFromUrl) {
          brandFromUrl.split(',').forEach(name => this.seleccionarMarcaPorNombre(name));
        }
        this.cdr.detectChanges();
        this.checkLoadingComplete();
      },
      error: (err) => {
        console.error('Error cargando marcas dinámicas:', err);
        this.checkLoadingComplete();
      },
    });
  }

  seleccionarMarcaPorNombre(nombre: string) {
    if (!nombre) return;
    const nombreUpper = nombre.toUpperCase();
    const marca = this.marcas.find(m => m.name === nombreUpper);
    if (marca) {
      marca.selected = true;
    }
  }

  // Métodos de selección y lógica de negocio
  seleccionarCarroceriaPorNombre(nombre: string) {
    if (!nombre) return;
    const nombreUpper = nombre.toUpperCase();
    const item = this.carrocerias.find((c) => c.name === nombreUpper);
    if (item) {
      item.selected = true;
    }
  }

  seleccionarCombustiblePorNombre(nombre: string) {
    if (!nombre) return;
    const nombreUpper = nombre.toUpperCase();
    const item = this.combustibles.find((f) => f.name === nombreUpper);
    if (item) {
      item.selected = true;
    }
  }

  get marcasPrincipales() {
    return this.marcas.slice(0, this.limiteMarcas);
  }

  get marcasFiltradas() {
    if (!this.terminoBusqueda) return this.marcas;
    return this.marcas.filter((marca) =>
      marca.name.toLowerCase().includes(this.terminoBusqueda.toLowerCase()),
    );
  }

  abrirModalMarcas() {
    this.isModalMarcasOpen = true;
  }
  cerrarModalMarcas() {
    this.isModalMarcasOpen = false;
    this.terminoBusqueda = '';
  }

  seleccionarMarca(marcaRecibida: any) {
    if (!marcaRecibida || !marcaRecibida.name) return;

    const nombreBusqueda = marcaRecibida.name.trim().toUpperCase();
    const marcaEncontrada = this.marcas.find((m) => m.name.trim().toUpperCase() === nombreBusqueda);

    if (marcaEncontrada) {
      // Simplemente cambiamos el estado de selección (toggle)
      marcaEncontrada.selected = !marcaEncontrada.selected;
    }
  }

  get marcaBusquedaTexto(): string {
    const otrasMarcasSeleccionadas = this.marcas.filter((m, i) => m.selected && i >= this.limiteMarcas);
    if (otrasMarcasSeleccionadas.length === 0) {
        return '+';
    }
    if (otrasMarcasSeleccionadas.length === 1) {
        return otrasMarcasSeleccionadas[0].name;
    }
    return `${otrasMarcasSeleccionadas.length} marcas`;
  }

  limpiarMarca() {
    this.marcas.forEach((m) => (m.selected = false));
  }
  limpiarCarroceria() {
    this.carrocerias.forEach((c) => (c.selected = false));
  }
  limpiarCombustible() {
    this.combustibles.forEach((f) => (f.selected = false));
  }

  // Métodos del Slider Circular
  get offsetCirculo() {
    const progreso = (this.precioActual - this.precioMin) / (this.precioMax - this.precioMin);
    return this.circunferencia * (1 - progreso);
  }
  get thumbX() {
    const progreso = (this.precioActual - this.precioMin) / (this.precioMax - this.precioMin);
    const angulo = progreso * 2 * Math.PI;
    return 50 + 40 * Math.cos(angulo);
  }
  get thumbY() {
    const progreso = (this.precioActual - this.precioMin) / (this.precioMax - this.precioMin);
    const angulo = progreso * 2 * Math.PI;
    return 50 + 40 * Math.sin(angulo);
  }

  iniciarArrastre(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.actualizarPrecioDesdeEvento(event);
  }
  arrastrar(event: MouseEvent | TouchEvent) {
    if (this.isDragging) this.actualizarPrecioDesdeEvento(event);
  }
  detenerArrastre() {
    this.isDragging = false;
  }

  private actualizarPrecioDesdeEvento(event: MouseEvent | TouchEvent) {
    if (!isPlatformBrowser(this.platformId)) return;
    const rect = this.sliderElement.nativeElement.getBoundingClientRect();
    const centroX = rect.left + rect.width / 2;
    const centroY = rect.top + rect.height / 2;
    let clienteX = event instanceof MouseEvent ? event.clientX : event.touches[0].clientX;
    let clienteY = event instanceof MouseEvent ? event.clientY : event.touches[0].clientY;

    let angulo = Math.atan2(clienteY - centroY, clienteX - centroX) + Math.PI / 2;
    if (angulo < 0) angulo += 2 * Math.PI;
    let porcentaje = angulo / (2 * Math.PI);
    let nuevoPrecio =
      Math.round((this.precioMin + porcentaje * (this.precioMax - this.precioMin)) / 500) * 500;

    this.precioActual = Math.min(this.precioMax, Math.max(this.precioMin, nuevoPrecio));
    this.precioModificado = true;
  }

  // Getters de estado
  get marcaActiva() {
    return this.marcas.some((m) => m.selected);
  }
  get carroceriaActiva() {
    return this.carrocerias.some((c) => c.selected);
  }
  get combustibleActivo() {
    return this.combustibles.some((c) => c.selected);
  }

  // Navegación y Búsqueda
  buscarTodos() {
    this.limpiezaFiltros();
    this.precioModificado = false;
    this.route.navigate(['/cars'], { queryParams: {} }).then(() => {
      // Recargamos las marcas para que vuelvan a salir las de coches disponibles
      this.cargarMarcasSegunEstado();
      this.carService.recargarCoches$.next();
    });
  }

  buscarConFiltros() {
    if (!isPlatformBrowser(this.platformId)) return;

    const queryParams: any = {};
    const marcasSeleccionadas = this.marcas.filter(m => m.selected).map(m => m.name);
    const carroceriasSeleccionadas = this.carrocerias.filter(c => c.selected).map(c => c.name);
    const combustiblesSeleccionados = this.combustibles.filter(f => f.selected).map(f => f.name);

    if (marcasSeleccionadas.length > 0) queryParams[btoa('brand')] = btoa(marcasSeleccionadas.join(','));
    if (carroceriasSeleccionadas.length > 0) queryParams[btoa('bodyType')] = btoa(carroceriasSeleccionadas.join(','));
    if (combustiblesSeleccionados.length > 0) queryParams[btoa('fuelType')] = btoa(combustiblesSeleccionados.join(','));

    if (this.precioModificado && this.precioActual > 0) {
      queryParams[btoa('maxPrice')] = btoa(this.precioActual.toString());
    }
    this.route.navigate(['/cars'], { queryParams });
  }

  // Seleccionar una opción de una lista (Marcas, Carrocerías o Combustibles)
  seleccionarOpcion(lista: any[], index: number) {
    if (!lista || !lista[index]) return;
    lista[index].selected = !lista[index].selected;
  }

  // Método centralizado y seguro para la URL
  private getParamFromUrl(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const params = new URLSearchParams(window.location.search);
        const encodedKey = btoa(key);
        const value = params.get(encodedKey);
        return value ? atob(value) : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  isAdmin(){
    if (this.authService.isLoggedIn()) {
          const user = this.authService.getCurrentUser();
          if (user) {
            this.isAdminV = atob(user.role) === UserRoles.ADMIN.toUpperCase();
          }
        }
  }
  limpiezaFiltros() {
    this.limpiarMarca();
    this.limpiarCarroceria();
    this.limpiarCombustible();
    this.precioActual = 0;
    this.precioModificado = false;
    this.resultadosAdmin = [];
    this.busquedaAdmin = '';
  }
  buscarAdmin() {
    const term = this.busquedaAdmin.trim();

    if (!term) {
      this.resultadosAdmin = [];
      return;
    }
    const queryParams: any = {};
    queryParams[btoa('search')] = btoa(term);

    this.route.navigate(['/cars'], {
      queryParams,
    });
  }

  alCambiarInterruptor() {
    this.limpiezaFiltros();

    // El ngModel ya ha actualizado el servicio a través del setter 'buscarEnVendidos'.
    // this.carService.mantenerVendidosActivo = this.buscarEnVendidos;

    // Actualizamos las fuentes de datos para los desplegables (marcas, combustibles).
    this.actualizarCombustiblesDinamicos();
    this.actualizarCarroceriasDinamicas();
    this.cargarMarcasSegunEstado();

    // Emitimos una señal para que el componente padre (Cars) se encargue de recargar.
    // El padre limpiará la URL y recargará la lista de coches.
    this.carService.recargarCoches$.next();
  }

  get buscarEnVendidos(): boolean {
    return this.carService.mantenerVendidosActivo;
  }
  set buscarEnVendidos(valor: boolean) {
    this.cdr.detectChanges();
    this.carService.mantenerVendidosActivo = valor;
  }
}
