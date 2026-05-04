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
import { environment } from '../../../../environments/environment.development';

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

  @ViewChild('timelineContainer') timelineContainer!: ElementRef; // ViewChild para el contenedor del historial
  constructor() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['listaFiltrada']) {
      const listaEntrante = navigation.extras.state['listaFiltrada'];
      // Mapeamos a IDs por seguridad
      this.carIds = listaEntrante.map((c: any) => c.id);
    }
  }

  // Estado del componente
  confirmandoBorrado: boolean = false;
  badgeLabel = BadgeLabel;
  badgeType = BadgeType;
  car: CarDetail | null = null;
  carIds: number[] = []; // Solo guardamos IDs para navegación Next/Prev
  currentIndex: number = 0;
  currentImageIndex: number = 0;
  isZoomed: boolean = false;
  isAdmin: boolean = false; 
  private scrollPosition: number = 0;

  // Contact Seller properties
  showContactSellerModal: boolean = false;
  contactForm!: FormGroup;
  sellerEmail: string[] = []; // Ahora es un array de strings
  sellerPhone: string[] = []; // Ahora es un array de strings
  isLoggedInUser: boolean = false; // Nueva propiedad para almacenar el estado de login

  // Drag-to-scroll properties para el historial
  isDraggingTimeline = false;
  startXTimeline: number = 0;
  scrollLeftStartTimeline = 0;
  velocityTimeline = 0;
  rafIdTimeline: number | null = null;

  ngOnInit(): void {
    // Initialize contact details from environment
    this.sellerEmail = environment.EMAIL_CONTACT
    this.sellerPhone = environment.NUMBER_CONTACT

    // Initialize contact form
    let userName = '';
    let userEmail = '';
    this.isLoggedInUser = this.authService.isLoggedIn(); // Establecer el estado de login inicialmente
    if (this.isLoggedInUser) {
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        userName = currentUser.user || '';
        userEmail = currentUser.correo || '';

      }
    }

    this.contactForm = this.fb.group({
      name: [userName, Validators.required],
      email: [userEmail, [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
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

        // Reset visual para mostrar el estado "Cargando"
        this.currentImageIndex = 0;
        this.cdr.detectChanges(); // Forzamos limpieza visual

        // 3. Pedimos el objeto DETAIL completo a la base de datos
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

            // Comprobar si es favorito
            if (this.authService.isLoggedIn() && this.car) {
              this.favoriteService.getMyFavorites().subscribe({
                next: (favs) => {
                  if (this.car) { // Doble chequeo por asincronía
                    this.car.isSaved = favs.some(favCar => favCar.id === this.car!.id);
                    this.cdr.detectChanges();
                  }
                },
                // Si falla la carga de favoritos, asumimos que no lo es.
                error: () => {
                  if (this.car) this.car.isSaved = false;
                  this.cdr.detectChanges();
                }
              });
            } else if (this.car) {
              this.car.isSaved = false;
            }
            // Si carIds está vacío (acceso directo por URL), lo inicializamos con el actual
            if (this.carIds.length === 0) {
              this.carIds = [this.car.id];
            }

            // Calculamos en qué posición estamos dentro de la lista de navegación
            this.currentIndex = this.carIds.indexOf(this.car.id);
           
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
    }
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
          this.car.isSaved = estadoAnterior; // Revertimos al estado original
        }
        this.cdr.detectChanges();
        this.toast.error(
          'No se pudo completar la acción. Por favor, inténtalo de nuevo.',
          'Error de conexión'
        );
      },
    });  }

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
    // Limpieza de estilos al salir del componente
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeStyle(document.body, 'overflow');
      if (this.isZoomed) {
        const navHeader = document.querySelector('.autoflow-header');
        if (navHeader) this.renderer.setStyle(navHeader, 'display', 'flex');
      }
    }
  }

  // --- Contact Seller Modal methods ---
  openContactSellerModal(): void {
    this.isLoggedInUser = this.authService.isLoggedIn(); // Actualizar el estado de login al abrir el modal
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
          email: currentUser.correo || ''
        });
      }
    }

    // Opcional: Resetear el formulario al cerrar el modal si no está logueado
    if (!this.isLoggedInUser) {
      this.contactForm.reset();
    }
    // Si estaba logueado, los campos ya estaban pre-rellenados, no es necesario resetear

    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeStyle(document.body, 'overflow');
    }
  }

  // El método onSubmitContactForm() ha sido eliminado ya que no hay un botón de envío
  // y la funcionalidad principal es generar el mailto link.


  getMailtoLinkForEmail(email: string): string { // Nuevo método que acepta el email como argumento
    if (!this.car) return `mailto:${email}`;

    let name = this.contactForm.get('name')?.value || '[Tu Nombre]'; // Usar valor del formulario
    let userEmail = this.contactForm.get('email')?.value || '[Tu Email]'; // Usar valor del formulario
    if(this.authService.isLoggedIn()){
    name = atob(this.contactForm.get('name')?.value) || '[Tu Nombre]'; // Usar valor del formulario
    userEmail = atob(this.contactForm.get('email')?.value) || '[Tu Email]'; // Usar valor del formulario

    
  }
  const subject = encodeURIComponent(`Consulta sobre el coche: ${this.car.make} ${this.car.model} (${this.car.year})`);
    const body = encodeURIComponent(
      `Hola, estoy interesado en el coche ${this.car.make} ${this.car.model} (${this.car.year}). ` +
      `Me gustaría obtener más información. Mi nombre es ${name} y mi email es ${userEmail}.`
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

  // --- Drag-to-scroll methods para el historial ---
  onTimelineMouseDown(e: MouseEvent) {
    if (!this.timelineContainer) return;
    this.isDraggingTimeline = true;
    const el = this.timelineContainer.nativeElement;

    this.startXTimeline = e.pageX - el.offsetLeft;
    this.scrollLeftStartTimeline = el.scrollLeft;

    el.style.scrollBehavior = 'auto'; // Deshabilita el smooth scroll durante el arrastre
    el.style.cursor = 'grabbing';

    if (this.rafIdTimeline) cancelAnimationFrame(this.rafIdTimeline);
  }

  onTimelineMouseMove(e: MouseEvent) {
    if (!this.isDraggingTimeline || !this.timelineContainer) return;
    e.preventDefault(); // Previene la selección de texto

    const el = this.timelineContainer.nativeElement;
    const x = e.pageX - el.offsetLeft;
    const walk = (x - this.startXTimeline) * 1.5; // Ajusta la sensibilidad si es necesario

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

  onTimelineMouseLeave() { // Añadido para detener el arrastre si el ratón sale del contenedor
    if (this.isDraggingTimeline) {
      this.onTimelineMouseUp();
    }
  }

  private applyTimelineInertia() {
    if (!this.timelineContainer) return;
    const el = this.timelineContainer.nativeElement;

    if (Math.abs(this.velocityTimeline) > 0.5) {
      el.scrollLeft += this.velocityTimeline;
      this.velocityTimeline *= 0.95; // Fricción
      this.rafIdTimeline = requestAnimationFrame(() => this.applyTimelineInertia());
    } else {
      el.style.scrollBehavior = 'smooth'; // Reactiva el smooth scroll después de la inercia
      this.rafIdTimeline = null;
    }
  }
}
