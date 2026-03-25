import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarDetail } from '../../../@types/interface/car-details.interface';
import { CarServiceBBDD } from '../../services/car-service-bbdd';

@Component({
  selector: 'detail-car',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-car.html',
  styleUrls: ['./detail-car.scss'],
})
export class DetailCar implements OnInit {
  constructor(private carsService: CarServiceBBDD){}
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private renderer = inject(Renderer2);
  private scrollPosition: number = 0;

  car: CarDetail | undefined;
  currentIndex: number = 0; // Índice en la lista de coches
  currentImageIndex: number = 0; // Índice de la foto en el álbum
  isZoomed: boolean = false;

  // Tu array de coches (Simulado, idealmente vendría de un Service)
  cars: CarDetail[] = []

  ngOnInit(): void {

    //TODO Aqui tendria que poner que coja por el filtro o los 10 mas destacados si los coge directamente de galeria dinamica

    this.carsService.getCarsDetails(this.route.snapshot.params['id']).subscribe({
      next: (data) => {
        this.car= data;
        this.loadCar(this.route.snapshot.params['id']);
        },
      error: (err) => {
        console.error('Error de conexión o de API:', err);
      },
    });



    this.route.paramMap.subscribe((params) => {
    const encodedId = params.get('id');
    
    if (encodedId) {
      try {
        // Decodificamos. Importante: no lo fuerces a Number todavía.
        const decodedId = atob(encodedId);
        
        // Si tus IDs en el array 'cars' son números, conviértelo aquí:
        const idFinal = isNaN(Number(decodedId)) ? decodedId : Number(decodedId);
        
        this.loadCar(idFinal);
      } catch (e) {
        console.error("Error decodificando el ID", e);
        this.router.navigate(['/home']);
      }
    }
  });
  }

  private loadCar(id: number | string): void {
    const idNumerico = Number(id);
    const foundCar = this.cars.find((c) => c.id === idNumerico);
    if (foundCar) {
      this.car = foundCar;
      this.currentImageIndex = 0;
      this.currentIndex = this.cars.findIndex((c) => c.id === idNumerico);
      this.closeZoom(); // Reset de zoom al cambiar de coche
    } else {
      this.router.navigate(['/home']);
    }
  }

  onImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    const currentSrc = imgElement.src;

    // Si intentó cargar un .jpg y falló, probamos con .png
    if (currentSrc.endsWith('.jpg')) {
      imgElement.src = currentSrc.replace('.jpg', '.png');
    }
    // Si intentó cargar un .png y falló, probamos con .jpg
    else if (currentSrc.endsWith('.png')) {
      imgElement.src = currentSrc.replace('.png', '.jpg');
    }
    // Si ambas fallan, le ponemos una imagen por defecto para que no se vea roto
    else {
      imgElement.src = 'assets/placeholder-car.jpg'; // Tu imagen por defecto
    }
  }

  // --- NAVEGACIÓN DE IMÁGENES ---
  nextImage() {
    if (!this.car?.imagesAlbum) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.car.imagesAlbum.length;
  }

  prevImage() {
    if (!this.car?.imagesAlbum) return;
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.car.imagesAlbum.length) % this.car.imagesAlbum.length;
  }

  setMainImage(index: number): void {
    this.currentImageIndex = index;
  }

  // --- ZOOM ---
  toggleZoom(): void {
    this.isZoomed = !this.isZoomed;
    const navHeader = document.querySelector('.autoflow-header');

    if (this.isZoomed) {
      // 1. Guardamos cuántos píxeles de scroll hay ahora mismo
      this.scrollPosition = window.pageYOffset;

      // 2. Aplicamos estilos al body para "congelarlo"
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
      if (navHeader) {
        this.renderer.setStyle(navHeader, 'display', 'none');
        // O si prefieres que no use espacio:
        // this.renderer.setStyle(navHeader, 'visibility', 'hidden');
      }
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
      if (navHeader) {
        this.renderer.setStyle(navHeader, 'display', 'flex'); // o 'block', según sea tu original
      }

      // 4. Devolvemos al usuario a su sitio exacto (importante)
      window.scrollTo(0, this.scrollPosition);
    }
  }

  ngOnDestroy(): void {
    this.renderer.removeStyle(document.body, 'overflow');
    this.renderer.removeStyle(document.body, 'position');
    this.renderer.removeStyle(document.body, 'top');
    this.renderer.removeStyle(document.body, 'width');
    this.renderer.removeStyle(document.body, 'background-color');
  }

  private closeZoom(): void {
    this.isZoomed = false;
    this.renderer.removeClass(document.body, 'no-scroll');
  }

  // --- NAVEGACIÓN ENTRE COCHES ---
  nextCar(): void {
    const nextIdx = (this.currentIndex + 1) % this.cars.length;
    const nextId = this.cars[nextIdx].id;
    // Codificamos el ID a Base64
    const encodedId = btoa(nextId.toString());
    this.router.navigate(['/detail-car', encodedId]);
  }

  prevCar(): void {
    const prevIdx = (this.currentIndex - 1 + this.cars.length) % this.cars.length;
    const prevId = this.cars[prevIdx].id;
    // Codificamos el ID a Base64
    const encodedId = btoa(prevId.toString());
    this.router.navigate(['/detail-car', encodedId]);
  }

  // --- WISHLIST ---
  toggleSave(): void {
    if (this.car) {
      this.car.isSaved = !this.car.isSaved;
    }
  }
}
