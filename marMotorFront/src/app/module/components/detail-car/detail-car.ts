import { ChangeDetectorRef, Component, OnInit, Renderer2, inject, OnDestroy, PLATFORM_ID } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CarDetail } from '../../../@types/interface/car-details.interface';
import { CarServiceBBDD } from '../../services/car-service-bbdd';
import { AuthServiceBBDD } from '../../services/auth-service';
import { UserRoles } from '../../../@types/enums/roles.enums';
import { BadgeLabel, BadgeType } from '../../../@types/enums/badge.enum';

@Component({
  selector: 'detail-car',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './detail-car.html',
  styleUrls: ['./detail-car.scss'],
})
export class DetailCar implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
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
  badgeLabel= BadgeLabel
  badgeType= BadgeType
  car: CarDetail | null = null;
  carIds: number[] = []; // Solo guardamos IDs para navegación Next/Prev
  currentIndex: number = 0;
  currentImageIndex: number = 0;
  isZoomed: boolean = false;
  isAdmin: boolean= true //! Cambiar a false
  private scrollPosition: number = 0;

  ngOnInit(): void {
    this.carIds= this.carsService.getCarIds();
    
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

  isRouteSold(){
    return this.car?.badge === BadgeType.SOLD
  }

  // --- ZOOM Y UI ---
  toggleZoom(): void {
    if (!isPlatformBrowser(this.platformId)) return;
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

  navigateToEdit(){
    if(this.car){
      const idCoded= btoa(this.car.id.toString())
      this.router.navigate(['/cars/edit-car', idCoded])
    }
  }
  ngOnDestroy(): void {
    // Limpieza de estilos al salir del componente
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeStyle(document.body, 'overflow');
      if (this.isZoomed) {
        const navHeader = document.querySelector('.autoflow-header');
        if (navHeader) this.renderer.setStyle(navHeader, 'display', 'flex');
      }
    }
  }
}
