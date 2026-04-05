import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { BrandDTO } from '../../../../@types/interface/brand.interface';
import { BrandServiceBBDD } from '../../../services/brand-service-bbdd';

import { FuelTypeServiceBBDD } from '../../../services/fuel-service-bbdd';
import { BadgeDTO } from '../../../../@types/interface/badge.interface';
import { FuelDTO } from '../../../../@types/interface/fuel.interface';
import { BodyTypeServiceBBDD } from '../../../services/bodyType-service-bbdd';

@Component({
  selector: 'app-filters',
  standalone: true,
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './filters.html',
  styleUrl: './filters.scss',
})
export class Filters {

  @Input() limiteMarcas: number = 10; 

  @Input() set initialFilters(value: any) {
  if (value) {
    // Decodificamos si usas Base64 en la URL (como vi en tu componente Cars)
    // Si no usas Base64, quita el atob()
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
  }
}

  @Output() filterChange = new EventEmitter<any>();

  constructor(
    private route: Router,
    private brandService: BrandServiceBBDD,
    private bodyTypeService: BodyTypeServiceBBDD,
    private fuelTypeService: FuelTypeServiceBBDD,
  ) {}

  marcas: BrandDTO[] = [];
  carrocerias: BadgeDTO[] = [];
  combustibles: FuelDTO[] = [];

  
  isModalMarcasOpen = false;
  terminoBusqueda = '';
  marcaBusqueda = '+';

  ngOnInit(): void {
    this.brandService.getBrands().subscribe({
    next: (data) => {
      this.marcas = data;
      this.marcas.forEach((item) => {
        item.name = item.name.toUpperCase();
        item.selected = false;
      });

      // --- IMPORTANTE: Comprobar si venimos de la Home con una marca ---
      const params = new URLSearchParams(window.location.search);
      const encodedBrandKey = btoa('brand');
      const brandEncodedValue = params.get(encodedBrandKey);

      if (brandEncodedValue) {
        const brandName = atob(brandEncodedValue);
        // Llamamos al método que acabamos de arreglar
        this.seleccionarMarca({ name: brandName });
      }
    },
    error: (err) => console.error(err)
  });

    this.bodyTypeService.getBadges().subscribe({
    next: (data) => {
      this.carrocerias = data;
      this.carrocerias.forEach((item) => {
        item.name = item.name.toUpperCase();
        item.selected = false;
      });
      const bodyFromUrl = this.getParamFromUrl('bodyType');
      if (bodyFromUrl) this.seleccionarCarroceriaPorNombre(bodyFromUrl);
    }
  });

    this.fuelTypeService.getFuels().subscribe({
    next: (data) => {
      this.combustibles = data;
      this.combustibles.forEach((item) => {
        item.name = item.name.toUpperCase();
        item.selected = false;
      });
      const fuelFromUrl = this.getParamFromUrl('fuelType');
      if (fuelFromUrl) this.seleccionarCombustiblePorNombre(fuelFromUrl);
    }
  });
  }

  seleccionarCarroceriaPorNombre(nombre: string) {
  if (!nombre) return;
  const nombreUpper = nombre.toUpperCase();
  this.carrocerias.forEach(c => c.selected = (c.name === nombreUpper));
}

// Marca el combustible como seleccionado buscando por nombre
seleccionarCombustiblePorNombre(nombre: string) {
  if (!nombre) return;
  const nombreUpper = nombre.toUpperCase();
  this.combustibles.forEach(f => f.selected = (f.name === nombreUpper));
}

  // Obtiene solo las 10 primeras marcas para la vista principal
  get marcasPrincipales() {
    return this.marcas.slice(0, this.limiteMarcas);
  }

  // Filtra las marcas en el modal según lo que el usuario escriba
  get marcasFiltradas() {
    if (!this.terminoBusqueda) {
      return this.marcas;
    }
    return this.marcas.filter((marca) => {
      return marca.name.toLowerCase().includes(this.terminoBusqueda.toLowerCase());
    });
  }

  // Abre el popup
  abrirModalMarcas() {
    this.isModalMarcasOpen = true;
  }

  // Cierra el popup y limpia el buscador
  cerrarModalMarcas() {
    this.isModalMarcasOpen = false;
    this.terminoBusqueda = '';
  }

  // Nueva función unificada para seleccionar marca
  seleccionarMarca(marcaRecibida: any) {
  if (!marcaRecibida || !marcaRecibida.name) return;

  const nombreBusqueda = marcaRecibida.name.trim().toUpperCase();

  // 1. Desmarcamos todas primero
  this.marcas.forEach((item) => (item.selected = false));

  // 2. Buscamos la marca en el array completo
  const marcaEncontrada = this.marcas.find(m => m.name.trim().toUpperCase() === nombreBusqueda);

  if (marcaEncontrada) {
    marcaEncontrada.selected = true;
    
    // 3. Calculamos su posición para ver si mostramos el nombre en el botón "+"
    const index = this.marcas.indexOf(marcaEncontrada);
    
    if (index >= this.limiteMarcas) {
      // Si es una marca "oculta", la ponemos en el botón de búsqueda
      this.marcaBusqueda = marcaEncontrada.name;
    } else {
      // Si es una de las 10 primeras, el botón extra vuelve a ser "+"
      this.marcaBusqueda = '+';
    }
  }
  
  this.cerrarModalMarcas();
}

  limpiarMarca() {
    this.marcas.forEach((item) => (item.selected = false));
    this.marcaBusqueda = '+';
  }

  limpiarCarroceria() {
    this.carrocerias.forEach((item) => (item.selected = false));
  }

  limpiarCombustible() {
    this.combustibles.forEach((item) => (item.selected = false));
  }

  // Variables para el precio
  precioActual = 0;
  precioMin = 0;
  precioMax = 20000;
  precioModificado = false; // Siempre activado para enviar el precio

  @ViewChild('sliderElement') sliderElement!: ElementRef;
  isDragging = false;

  circunferencia = 2 * Math.PI * 40;

  // --- Funciones Interactivas ---

  // Seleccionar una opción (y desmarcar las demás)
  seleccionarOpcion(lista: any[], index: number) {
    lista.forEach((item) => (item.selected = false));
    lista[index].selected = true;
  }

  get offsetCirculo() {
    const progreso = (this.precioActual - this.precioMin) / (this.precioMax - this.precioMin);
    return this.circunferencia * (1 - progreso);
  }

  // Calcula la posición X del indicador (la bolita blanca)
  get thumbX() {
    const progreso = (this.precioActual - this.precioMin) / (this.precioMax - this.precioMin);
    const angulo = progreso * 2 * Math.PI; // Convertimos el porcentaje a radianes
    return 50 + 40 * Math.cos(angulo); // Centro X (50) + Radio (40) * cos(ángulo)
  }

  // Calcula la posición Y del indicador
  get thumbY() {
    const progreso = (this.precioActual - this.precioMin) / (this.precioMax - this.precioMin);
    const angulo = progreso * 2 * Math.PI;
    return 50 + 40 * Math.sin(angulo); // Centro Y (50) + Radio (40) * sin(ángulo)
  }

  iniciarArrastre(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    this.actualizarPrecioDesdeEvento(event);
    event.preventDefault(); // Evita que se seleccione texto por accidente
  }

  // Cuando el usuario mueve el ratón o el dedo por la pantalla
  arrastrar(event: MouseEvent | TouchEvent) {
    if (!this.isDragging) return;
    this.actualizarPrecioDesdeEvento(event);
  }

  // Cuando el usuario suelta el clic o levanta el dedo
  detenerArrastre() {
    this.isDragging = false; // Asegura que el filtro se active al soltar
  }

  // Calcula el porcentaje para el gráfico circular (0 a 100)
  get porcentajePrecio() {
    return ((this.precioActual - this.precioMin) / (this.precioMax - this.precioMin)) * 100;
  }

  private actualizarPrecioDesdeEvento(event: MouseEvent | TouchEvent) {
    // 1. Obtener el centro exacto del círculo en la pantalla
    const rect = this.sliderElement.nativeElement.getBoundingClientRect();
    const centroX = rect.left + rect.width / 2;
    const centroY = rect.top + rect.height / 2;

    // 2. Obtener la posición del ratón o del dedo
    let clienteX, clienteY;
    if (event instanceof MouseEvent) {
      clienteX = event.clientX;
      clienteY = event.clientY;
    } else {
      clienteX = event.touches[0].clientX;
      clienteY = event.touches[0].clientY;
    }

    // 3. Calcular el ángulo usando trigonometría (atan2)
    const x = clienteX - centroX;
    const y = clienteY - centroY;

    // Ajustamos para que las 12 en punto sea el valor 0 (inicio)
    let angulo = Math.atan2(y, x) + Math.PI / 2;
    if (angulo < 0) {
      angulo += 2 * Math.PI; // Corregir valores negativos
    }

    // 4. Convertir el ángulo en un porcentaje (de 0 a 1)
    let porcentaje = angulo / (2 * Math.PI);

    // 5. Calcular el nuevo precio en base al porcentaje
    const rangoPrecio = this.precioMax - this.precioMin;
    let nuevoPrecio = this.precioMin + porcentaje * rangoPrecio;

    // 6. Redondear el precio para que no tenga céntimos feos (ej: va de 500 en 500)
    nuevoPrecio = Math.round(nuevoPrecio / 500) * 500;

    // 7. Asegurar que no se pase de los límites
    if (nuevoPrecio > this.precioMax) nuevoPrecio = this.precioMax;
    if (nuevoPrecio < this.precioMin) nuevoPrecio = this.precioMin;

    this.precioActual = nuevoPrecio;
    this.precioModificado = true; // Si el usuario lo mueve, se activa el filtro
  }

  get marcaActiva() {
    const seleccionada = this.marcas.find((m) => m.selected);
    return seleccionada ? seleccionada.name : null;
  }

  get carroceriaActiva() {
    const seleccionada = this.carrocerias.find((c) => c.selected);
    return seleccionada ? seleccionada.name : null;
  }

  get combustibleActivo() {
    const seleccionada = this.combustibles.find((c) => c.selected);
    return seleccionada ? seleccionada.name : null;
  }

  buscarTodos() {
    // Cambia '/galeria' por la ruta real que tengas configurada en tu app.routes.ts
    this.limpiarMarca();
    this.limpiarCarroceria();
    this.limpiarCombustible();
    this.precioActual = 0;
    this.precioModificado = false;

    this.route.navigate(['/coches']);
  }

  // Botón 2: Navega a la galería pasando los filtros por la URL
  buscarConFiltros() {
    const queryParams: any = {};

    // 2. Solo añadimos las propiedades si tienen un valor real
    if (this.marcaActiva) {
      queryParams[btoa('brand')] = btoa(this.marcaActiva);
    }
    if (this.carroceriaActiva) {
      queryParams[btoa('bodyType')] = btoa(this.carroceriaActiva);
    }
    if (this.combustibleActivo) {
      queryParams[btoa('fuelType')] = btoa(this.combustibleActivo);
    }
    if (this.precioModificado && this.precioActual > 0) {
      queryParams[btoa('maxPrice')] = btoa(this.precioActual.toString());
    }

    // Navegamos a la ruta y le adjuntamos los filtros
    this.route.navigate(['/coches'], { queryParams: queryParams });
  }

  private getParamFromUrl(key: string): string | null {
  const params = new URLSearchParams(window.location.search);
  const encodedKey = btoa(key);
  const value = params.get(encodedKey);
  return value ? atob(value) : null;
}
}
