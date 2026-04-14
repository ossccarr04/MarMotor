import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Inject,
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

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
})
export class Filters implements OnInit {
  @Input() limiteMarcas: number = 10;

  @Input() set initialFilters(value: any) {
    // Protección para evitar ejecutar lógica de decodificación en el servidor
    if (value && isPlatformBrowser(this.platformId)) {
      try {
        const brand = value[btoa('brand')] ? atob(value[btoa('brand')]) : null;
        const body = value[btoa('bodyType')] ? atob(value[btoa('bodyType')]) : null;
        const fuel = value[btoa('fuelType')] ? atob(value[btoa('fuelType')]) : null;
        const price = value[btoa('maxPrice')] ? atob(value[btoa('maxPrice')]) : null;

        if (brand) this.seleccionarMarca({ name: brand.toUpperCase() });
        if (body) this.seleccionarCarroceriaPorNombre(body);
        if (fuel) this.seleccionarCombustiblePorNombre(fuel);

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

  constructor(
    private route: Router,
    private brandService: BrandServiceBBDD,
    private bodyTypeService: BodyTypeServiceBBDD,
    private fuelTypeService: FuelTypeServiceBBDD,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}

  marcas: BrandDTO[] = [];
  carrocerias: BodyTypeDTO[] = [];
  combustibles: FuelDTO[] = [];

  isModalMarcasOpen = false;
  terminoBusqueda = '';
  marcaBusqueda = '+';

  // Variables para el precio
  precioActual = 0;
  precioMin = 0;
  precioMax = 20000;
  precioModificado = false;
  circunferencia = 2 * Math.PI * 40;
  isDragging = false;
  busquedaAdmin: string = '';
  resultadosAdmin: any[] = [];
  isAdmin: boolean = true; //! Cambiar a true

  @ViewChild('sliderElement') sliderElement!: ElementRef;

  ngOnInit(): void {
    // 1. Cargar Marcas
    this.brandService.getBrands().subscribe({
      next: (data) => {
        this.marcas = data;
        this.marcas.forEach((item) => {
          item.name = item.name.toUpperCase();
          item.selected = false;
        });

        // PROTECCIÓN SSR: Usamos el método seguro getParamFromUrl
        const brandFromUrl = this.getParamFromUrl('brand');
        if (brandFromUrl) {
          this.seleccionarMarca({ name: brandFromUrl });
        }
      },
    });

    // 2. Cargar Carrocerías
    this.bodyTypeService.getBodyTypes().subscribe({
      next: (data) => {
        this.carrocerias = data;
        this.carrocerias.forEach((item) => {
          item.name = item.name.toUpperCase();
          item.selected = false;
        });
        const bodyFromUrl = this.getParamFromUrl('bodyType');
        if (bodyFromUrl) this.seleccionarCarroceriaPorNombre(bodyFromUrl);
      },
    });

    // 3. Cargar Combustibles
    this.fuelTypeService.getFuels().subscribe({
      next: (data) => {
        this.combustibles = data;
        this.combustibles.forEach((item) => {
          item.name = item.name.toUpperCase();
          item.selected = false;
        });
        const fuelFromUrl = this.getParamFromUrl('fuelType');
        if (fuelFromUrl) this.seleccionarCombustiblePorNombre(fuelFromUrl);
      },
    });
  }

  // Métodos de selección y lógica de negocio
  seleccionarCarroceriaPorNombre(nombre: string) {
    if (!nombre) return;
    const nombreUpper = nombre.toUpperCase();
    this.carrocerias.forEach((c) => (c.selected = c.name === nombreUpper));
  }

  seleccionarCombustiblePorNombre(nombre: string) {
    if (!nombre) return;
    const nombreUpper = nombre.toUpperCase();
    this.combustibles.forEach((f) => (f.selected = f.name === nombreUpper));
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
    this.marcas.forEach((item) => (item.selected = false));

    const marcaEncontrada = this.marcas.find((m) => m.name.trim().toUpperCase() === nombreBusqueda);
    if (marcaEncontrada) {
      marcaEncontrada.selected = true;
      const index = this.marcas.indexOf(marcaEncontrada);
      this.marcaBusqueda = index >= this.limiteMarcas ? marcaEncontrada.name : '+';
    }
    this.cerrarModalMarcas();
  }

  limpiarMarca() {
    this.marcas.forEach((m) => (m.selected = false));
    this.marcaBusqueda = '+';
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
    return this.marcas.find((m) => m.selected)?.name || null;
  }
  get carroceriaActiva() {
    return this.carrocerias.find((c) => c.selected)?.name || null;
  }
  get combustibleActivo() {
    return this.combustibles.find((c) => c.selected)?.name || null;
  }

  // Navegación
  buscarTodos() {
    this.limpiarMarca();
    this.limpiarCarroceria();
    this.limpiarCombustible();
    this.precioActual = 0;
    this.precioModificado = false;
    this.route.navigate(['/cars']);
  }

  buscarConFiltros() {
    if (!isPlatformBrowser(this.platformId)) return;
    const queryParams: any = {};
    if (this.marcaActiva) queryParams[btoa('brand')] = btoa(this.marcaActiva);
    if (this.carroceriaActiva) queryParams[btoa('bodyType')] = btoa(this.carroceriaActiva);
    if (this.combustibleActivo) queryParams[btoa('fuelType')] = btoa(this.combustibleActivo);
    if (this.precioModificado && this.precioActual > 0) {
      queryParams[btoa('maxPrice')] = btoa(this.precioActual.toString());
    }
    this.route.navigate(['/cars'], { queryParams });
  }

  // Seleccionar una opción de una lista (Carrocerías o Combustibles)
  seleccionarOpcion(lista: any[], index: number) {
    if (!lista || !lista[index]) return;

    // 1. Si la opción ya estaba seleccionada, la desmarcamos (opcional, por si quieres poder "des-filtrar")
    if (lista[index].selected) {
      lista[index].selected = false;
    } else {
      // 2. Desmarcamos todas las demás y marcamos la nueva
      lista.forEach((item) => (item.selected = false));
      lista[index].selected = true;
    }

    // 3. (Opcional) Si quieres que filtre al instante sin dar al botón "Buscar"
    // this.emitirCambios();
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

  buscarAdmin() {
    const term = this.busquedaAdmin.trim();

    if (!term) {
      this.resultadosAdmin = [];
      return;
    }

    this.route.navigate(['/cars'], {
    queryParams: { search: btoa(term) }
  });
  }

}
