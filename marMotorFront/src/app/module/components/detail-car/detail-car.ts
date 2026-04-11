import { ChangeDetectorRef, Component, OnInit, Renderer2, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CarDetail } from '../../../@types/interface/car-details.interface';
import { CarServiceBBDD } from '../../services/car-service-bbdd';
import { AuthServiceBBDD } from '../../services/auth-service';
import { UserRoles } from '../../../@types/enums/roles.enums';

@Component({
  selector: 'detail-car',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detail-car.html',
  styleUrls: ['./detail-car.scss'],
})
export class DetailCar implements OnInit, OnDestroy {
  // Inyecciones
  constructor(private carsService: CarServiceBBDD, private authService: AuthServiceBBDD) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['listaFiltrada']) {
      const listaEntrante = navigation.extras.state['listaFiltrada'];
      // Mapeamos a IDs por seguridad
      this.carIds = listaEntrante.map((c: any) => c.id);
    }
  }
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private renderer = inject(Renderer2);

  // Estado del componente
  car: CarDetail | null = null;
  carIds: number[] = []; // Solo guardamos IDs para navegación Next/Prev
  currentIndex: number = 0;
  currentImageIndex: number = 0;
  isZoomed: boolean = false;
  isAdmin: boolean= true //! Cambiar a false
  private scrollPosition: number = 0;

  ngOnInit(): void {
    if(this.authService.isLoggedIn()) {
          const user = this.authService.getCurrentUser();
          if(user) {
            this.isAdmin = atob(user.rol) === UserRoles.ADMIN; 
          }
        }

    this.route.paramMap.subscribe((params) => {
      const encodedId = params.get('id');
      if (!encodedId) return;

      try {
        // Decodificamos el ID de Base64
        const decodedId = atob(encodedId);
        const idNumerico = Number(decodedId);

        // Reset visual para mostrar el estado "Cargando"
        this.currentImageIndex = 0;
        this.cdr.detectChanges(); // Forzamos limpieza visual

        // 3. Pedimos el objeto DETAIL completo a la base de datos
        this.carsService.getCarsDetails(idNumerico).subscribe({
          next: (data) => {
            this.car = data;
            this.car.fuelType= this.car.fuelType.toLowerCase()
            this.car.transmission= this.car.transmission.toLowerCase()
            this.car.bodyType= this.car.bodyType?.toLocaleLowerCase() ?? null;

            // Si carIds está vacío (acceso directo por URL), lo inicializamos con el actual
            if (this.carIds.length === 0) {
              this.carIds = [data.id];
            }

            // Calculamos en qué posición estamos dentro de la lista de navegación
            this.currentIndex = this.carIds.indexOf(data.id);

            // Forzamos el renderizado inmediato para evitar el lag de "cargando"
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error al obtener detalles del servidor:', err);
            this.router.navigate(['/home']);
          },
        });
      } catch (e) {
        console.error('Error en la decodificación del ID:', e);
        this.router.navigate(['/home']);
      }
    });
  }

  // --- NAVEGACIÓN ENTRE COCHES ---
  nextCar(): void {
    if (this.carIds.length <= 1) return;
    const nextIdx = (this.currentIndex + 1) % this.carIds.length;
    this.navegarAId(this.carIds[nextIdx]);
  }

  prevCar(): void {
    if (this.carIds.length <= 1) return;
    const prevIdx = (this.currentIndex - 1 + this.carIds.length) % this.carIds.length;
    this.navegarAId(this.carIds[prevIdx]);
  }

  private navegarAId(id: number): void {
    const encodedId = btoa(id.toString());
    // Pasamos de nuevo el estado de los IDs para que no se pierda la lista al navegar
    this.router.navigate(['/detail-car', encodedId], {
      state: { listaFiltrada: this.carIds.map((id) => ({ id })) },
    });
  }

  // --- GESTIÓN DE IMÁGENES ---
  nextImage(): void {
    if (!this.car?.imagesAlbum) return;
    this.currentImageIndex = (this.currentImageIndex + 1) % this.car.imagesAlbum.length;
  }

  prevImage(): void {
    if (!this.car?.imagesAlbum) return;
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.car.imagesAlbum.length) % this.car.imagesAlbum.length;
  }

  setMainImage(index: number): void {
    this.currentImageIndex = index;
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/placeholder-car.jpg'; // Imagen por defecto si falla el servidor
  }

  // --- ZOOM Y UI ---
  toggleZoom(): void {
    this.isZoomed = !this.isZoomed;
    const navHeader = document.querySelector('.autoflow-header');

    if (this.isZoomed) {
      this.scrollPosition = window.pageYOffset;
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
      if (navHeader) this.renderer.setStyle(navHeader, 'display', 'none');
    } else {
      this.renderer.removeStyle(document.body, 'overflow');
      if (navHeader) this.renderer.setStyle(navHeader, 'display', 'flex');
      window.scrollTo(0, this.scrollPosition);
    }
  }

  toggleSave(): void {
    if (this.car) {
      this.car.isSaved = !this.car.isSaved;
      // TODO: Aquí deberías llamar a un servicio para persistir el favorito en la BBDD
    }
  }

  ngOnDestroy(): void {
    // Limpieza de estilos al salir del componente
    this.renderer.removeStyle(document.body, 'overflow');
    if (this.isZoomed) {
      const navHeader = document.querySelector('.autoflow-header');
      if (navHeader) this.renderer.setStyle(navHeader, 'display', 'flex');
    }
  }
}
