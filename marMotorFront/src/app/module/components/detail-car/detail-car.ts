import {
  ChangeDetectorRef,
  Component,
  OnInit,
  Renderer2,
  inject,
  OnDestroy,
  PLATFORM_ID,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { CarDetail } from '../../../@types/interface/car-details.interface';
import { CarServiceBBDD } from '../../services/car-service-bbdd';
import { AuthServiceBBDD } from '../../services/auth-service';
import { UserRoles } from '../../../@types/enums/roles.enums';
import { BadgeLabel, BadgeType } from '../../../@types/enums/badge.enum';
import { ToastrService } from 'ngx-toastr';
import { FavoriteServiceBBDD } from '../../services/favorite-service-bbdd';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../../environments/environment.prod';

@Component({
  selector: 'detail-car',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './detail-car.html',
  styleUrls: ['./detail-car.scss'],
})
export class DetailCar implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private carsService = inject(CarServiceBBDD);
  private authService = inject(AuthServiceBBDD);
  private toast = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private renderer = inject(Renderer2);
  private favoriteService = inject(FavoriteServiceBBDD);
  private fb = inject(FormBuilder);

  @ViewChild('timelineContainer') timelineContainer!: ElementRef;
  constructor() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['listaFiltrada']) {
      const listaEntrante = navigation.extras.state['listaFiltrada'];

      this.carIds = listaEntrante.map((c: any) => c.id);
    }
  }

  confirmandoBorrado: boolean = false;
  badgeLabel = BadgeLabel;
  badgeType = BadgeType;
  car: CarDetail | null = null;
  carIds: number[] = [];
  currentIndex: number = 0;
  currentImageIndex: number = 0;
  isZoomed: boolean = false;
  isAdmin: boolean = false;
  private scrollPosition: number = 0;

  zoomLevel = 1;
  imagePosition = { x: 0, y: 0 };
  isDraggingImage = false;
  private dragStart = { x: 0, y: 0 };
  private lastImagePosition = { x: 0, y: 0 };
  private initialPinchDistance: number | null = null;

  showContactSellerModal: boolean = false;
  contactForm!: FormGroup;
  sellerEmail: string[] = [];
  sellerPhone: string[] = [];
  isLoggedInUser: boolean = false;

  isDraggingTimeline = false;
  startXTimeline: number = 0;
  scrollLeftStartTimeline = 0;
  velocityTimeline = 0;
  rafIdTimeline: number | null = null;

  ngOnInit(): void {
    this.sellerEmail = environment.EMAIL_CONTACT;
    this.sellerPhone = environment.NUMBER_CONTACT;

    let userName = '';
    let userEmail = '';
    this.isLoggedInUser = this.authService.isLoggedIn();
    if (this.isLoggedInUser) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        userName = currentUser.user || '';
        userEmail = currentUser.correo || '';
      }
    }

    this.contactForm = this.fb.group({
      name: [userName, Validators.required],
      email: [
        userEmail,
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
    });

    if (this.carIds.length === 0) {
      this.carIds = this.carsService.getCarIds();
    }

    if (this.authService.isLoggedIn()) {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.isAdmin = atob(user.role) === UserRoles.ADMIN.toUpperCase();
      }
    }

    this.route.paramMap.subscribe((params) => {
      const encodedId = params.get('id');
      if (!encodedId) return;

      try {
        // Decodificamos el ID de Base64
        const decodedId = atob(encodedId);
        const idNumerico = Number(decodedId);

        this.currentImageIndex = 0;
        this.cdr.detectChanges();

        this.carsService.getCarsDetails(idNumerico).subscribe({
          next: (data) => {
            if (!data) {
              this.router.navigate(['/home']);
              return;
            }
            // Transformamos los datos ANTES de asignarlos para evitar errores en el template
            const processedCar = { ...data };
            processedCar.badge = data.badge ? (data.badge.toLowerCase() as BadgeType) : null;
            processedCar.fuelType = data.fuelType ? data.fuelType.toLowerCase() : '';
            processedCar.transmission = data.transmission ? data.transmission.toLowerCase() : '';
            processedCar.bodyType = data.bodyType ? data.bodyType.toLowerCase() : null;
            this.car = processedCar;

            if (this.authService.isLoggedIn() && this.car) {
              this.favoriteService.getMyFavorites().subscribe({
                next: (favs) => {
                  if (this.car) {
                    this.car.isSaved = favs.some((favCar) => favCar.id === this.car!.id);
                    this.cdr.detectChanges();
                  }
                },

                error: () => {
                  if (this.car) this.car.isSaved = false;
                  this.cdr.detectChanges();
                },
              });
            } else if (this.car) {
              this.car.isSaved = false;
            }

            if (this.carIds.length === 0) {
              this.carIds = [this.car.id];
            }

            this.currentIndex = this.carIds.indexOf(this.car.id);

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

  isRouteSold() {
    return this.car?.badge === BadgeType.SOLD;
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
      // Reseteamos el estado del zoom al cerrar
      this.resetZoom();
    }
  }

  private resetZoom(): void {
    this.zoomLevel = 1;
    this.imagePosition = { x: 0, y: 0 };
    this.lastImagePosition = { x: 0, y: 0 };
    this.isDraggingImage = false;
    this.initialPinchDistance = null;
  }

  toggleSave(): void {
    if (!this.car) return;

    if (!this.authService.isLoggedIn()) {
      this.toast.info('Debes iniciar sesión para guardar favoritos', 'Acción requerida');
      return;
    }

    const estadoAnterior = this.car.isSaved;

    // 1. Actualización optimista de la UI
    this.car.isSaved = !estadoAnterior;
    this.cdr.detectChanges();

    const peticion = estadoAnterior
      ? this.favoriteService.removeFavorite(this.car.id)
      : this.favoriteService.addFavorite(this.car.id);

    peticion.subscribe({
      // 2. En caso de éxito, no hacemos nada porque la UI ya está actualizada.
      next: () => {},
      // 3. En caso de error, revertimos el cambio en la UI y notificamos al usuario.
      error: (err) => {
        console.error(estadoAnterior ? 'Error al eliminar:' : 'Error al guardar:', err);
        if (this.car) {
          this.car.isSaved = estadoAnterior;
        }
        this.cdr.detectChanges();
        this.toast.error(
          'No se pudo completar la acción. Por favor, inténtalo de nuevo.',
          'Error de conexión',
        );
      },
    });
  }

  prepararEliminacion() {
    this.confirmandoBorrado = true;
  }

  cancelarEliminacion() {
    this.confirmandoBorrado = false;
  }

  ejecutarEliminacion(id: number) {
    this.carsService.deleteCar(id).subscribe({
      next: () => {
        this.toast.success('Vehículo eliminado con éxito de la base de datos', 'Exito');
        this.router.navigate(['/cars']);
      },
      error: () => this.toast.error('Error al eliminar', 'Error'),
    });
  }

  navigateToEdit() {
    if (this.car) {
      const idCoded = btoa(this.car.id.toString());
      this.router.navigate(['/cars/edit-car', idCoded]);
    }
  }
  ngOnDestroy(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeStyle(document.body, 'overflow');
      if (this.isZoomed) {
        const navHeader = document.querySelector('.autoflow-header');
        if (navHeader) this.renderer.setStyle(navHeader, 'display', 'flex');
      }
    }
  }

  openContactSellerModal(): void {
    this.isLoggedInUser = this.authService.isLoggedIn();
    this.showContactSellerModal = true;

    // Si no está logueado, asegurar que los campos del formulario estén vacíos o reseteados
    if (!this.isLoggedInUser) {
      this.contactForm.reset({ name: '', email: '' });
    } else {
      // Si está logueado, asegurar que los campos estén pre-rellenados
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        this.contactForm.patchValue({
          name: currentUser.user || '',
          email: currentUser.correo || '',
        });
      }
    }

    if (!this.isLoggedInUser) {
      this.contactForm.reset();
    }

    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  getMailtoLinkForEmail(email: string): string {
    if (!this.car) return `mailto:${email}`;

    let name = this.contactForm.get('name')?.value || '[Tu Nombre]';
    let userEmail = this.contactForm.get('email')?.value || '[Tu Email]';
    if (this.authService.isLoggedIn()) {
      name = atob(this.contactForm.get('name')?.value) || '[Tu Nombre]';
      userEmail = atob(this.contactForm.get('email')?.value) || '[Tu Email]';
    }
    const subject = encodeURIComponent(
      `Consulta sobre el coche: ${this.car.make} ${this.car.model} (${this.car.year})`,
    );
    const body = encodeURIComponent(
      `Hola, estoy interesado en el coche ${this.car.make} ${this.car.model} (${this.car.year}). ` +
        `Me gustaría obtener más información. Mi nombre es ${name} y mi email es ${userEmail}.`,
    );
    return `mailto:${email}?subject=${subject}&body=${body}`;
  }
  isEmailContactEnabled(): boolean {
    // Si el usuario está logueado, los campos están pre-rellenados y válidos, así que el enlace está activo.
    if (this.isLoggedInUser) {
      return true;
    }
    // Si no está logueado, el enlace está activo solo si los campos de nombre y email son válidos.
    return !!(this.contactForm.get('name')?.valid && this.contactForm.get('email')?.valid);
  }

  closeContactSellerModal(): void {
    this.showContactSellerModal = false;
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  onTimelineMouseDown(e: MouseEvent) {
    if (!this.timelineContainer) return;

    const target = e.target as HTMLElement;

    const isLine = target.closest('.timeline-line');
    const isNodePoint = target.closest('.node-point');

    if (!isLine && !isNodePoint) {
      return;
    }

    this.isDraggingTimeline = true;
    const el = this.timelineContainer.nativeElement;

    this.startXTimeline = e.pageX - el.offsetLeft;
    this.scrollLeftStartTimeline = el.scrollLeft;

    el.style.scrollBehavior = 'auto';
    el.style.cursor = 'grabbing';

    if (this.rafIdTimeline) cancelAnimationFrame(this.rafIdTimeline);
  }

  onTimelineMouseMove(e: MouseEvent) {
    if (!this.isDraggingTimeline || !this.timelineContainer) return;
    e.preventDefault();

    const el = this.timelineContainer.nativeElement;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - this.startXTimeline) * 1.5;

    const prevScrollLeft = el.scrollLeft;
    el.scrollLeft = this.scrollLeftStartTimeline - walk;
    this.velocityTimeline = el.scrollLeft - prevScrollLeft;
  }

  onTimelineMouseUp() {
    if (!this.isDraggingTimeline || !this.timelineContainer) return;
    this.isDraggingTimeline = false;
    const el = this.timelineContainer.nativeElement;
    el.style.cursor = 'grab';
    this.applyTimelineInertia();
  }

  onTimelineMouseLeave() {
    if (this.isDraggingTimeline) {
      this.onTimelineMouseUp();
    }
  }

  private applyTimelineInertia() {
    if (!this.timelineContainer) return;
    const el = this.timelineContainer.nativeElement;

    if (Math.abs(this.velocityTimeline) > 0.5) {
      el.scrollLeft += this.velocityTimeline;
      this.velocityTimeline *= 0.95;
      this.rafIdTimeline = requestAnimationFrame(() => this.applyTimelineInertia());
    } else {
      el.style.scrollBehavior = 'smooth';
      this.rafIdTimeline = null;
    }
  }

  // --- LÓGICA DE ZOOM Y PANEO DE IMAGEN ---

  onWheel(event: WheelEvent): void {
    if (!this.isZoomed) return;
    event.preventDefault();

    const zoomIntensity = 0.1;
    const newZoomLevel = this.zoomLevel - event.deltaY * zoomIntensity * 0.05;

    this.zoomLevel = Math.max(1, Math.min(newZoomLevel, 5));

    if (this.zoomLevel <= 1) {
      this.resetZoom();
    }
    this.cdr.detectChanges();
  }

  onImageMouseDown(event: MouseEvent): void {
    if (this.zoomLevel > 1) {
      event.preventDefault();
      this.isDraggingImage = true;
      this.dragStart = { x: event.clientX, y: event.clientY };
      this.lastImagePosition = { ...this.imagePosition };
      (event.target as HTMLElement).style.cursor = 'grabbing';
    }
  }

  onImageMouseMove(event: MouseEvent): void {
    if (this.isDraggingImage) {
      const dx = event.clientX - this.dragStart.x;
      const dy = event.clientY - this.dragStart.y;

      this.imagePosition.x = this.lastImagePosition.x + dx / this.zoomLevel;
      this.imagePosition.y = this.lastImagePosition.y + dy / this.zoomLevel;
    }
  }

  onImageMouseUp(event: MouseEvent): void {
    if (this.isDraggingImage) {
      this.isDraggingImage = false;
      (event.target as HTMLElement).style.cursor = 'grab';
    }
  }

  // --- EVENTOS TÁCTILES PARA MÓVIL ---

  onTouchStart(event: TouchEvent): void {
    if (!this.isZoomed) return;

    if (event.touches.length === 2) {
      event.preventDefault();
      this.initialPinchDistance = this.getPinchDistance(event);
    } else if (event.touches.length === 1 && this.zoomLevel > 1) {
      event.preventDefault();
      this.isDraggingImage = true;
      this.dragStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
      this.lastImagePosition = { ...this.imagePosition };
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (!this.isZoomed) return;

    if (event.touches.length === 2 && this.initialPinchDistance) {
      event.preventDefault();
      const newPinchDistance = this.getPinchDistance(event);
      const zoomFactor = newPinchDistance / this.initialPinchDistance;
      this.zoomLevel = Math.max(1, Math.min(this.zoomLevel * zoomFactor, 5));
      this.initialPinchDistance = newPinchDistance;
    } else if (event.touches.length === 1 && this.isDraggingImage) {
      event.preventDefault();
      const dx = event.touches[0].clientX - this.dragStart.x;
      const dy = event.touches[0].clientY - this.dragStart.y;
      this.imagePosition.x = this.lastImagePosition.x + dx / this.zoomLevel;
      this.imagePosition.y = this.lastImagePosition.y + dy / this.zoomLevel;
    }
  }

  onTouchEnd(): void {
    this.isDraggingImage = false;
    this.initialPinchDistance = null;
    if (this.zoomLevel <= 1) this.resetZoom();
  }

  private getPinchDistance(event: TouchEvent): number {
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }
}
