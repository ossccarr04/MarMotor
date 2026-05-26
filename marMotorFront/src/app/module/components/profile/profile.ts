import { Component, inject, ChangeDetectorRef, NgZone, OnInit, OnDestroy } from '@angular/core';
import { AuthServiceBBDD } from '../../services/auth-service';
import { CarDTO } from '../../../@types/interface/car.interface';
import { Router, RouterLink } from '@angular/router';
import { FavoriteServiceBBDD } from '../../services/favorite-service-bbdd';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { UserServiceBBDD } from '../../services/user-service-bbdd';
import { UserDTO } from '../../../@types/interface/user.interface';
import { Subject, takeUntil } from 'rxjs';
import { ChangePassword } from '../change-password/change-password';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, CommonModule, ChangePassword],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit, OnDestroy {
  private favoriteService = inject(FavoriteServiceBBDD);
  private authService = inject(AuthServiceBBDD);
  private userService = inject(UserServiceBBDD);
  private router = inject(Router);
  private toast = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  favoriteCars: CarDTO[] = [];
  public profileData: UserDTO | null = null;
  public isConfirmingDelete: boolean = false;
  public isChangePasswordModalOpen = false;
  private deleteConfirmTimeout: any;
  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.loadFavorites();
      this.loadProfile();
    }

    this.authService.authStatus$.pipe(takeUntil(this.destroy$)).subscribe((isLoggedIn) => {
      if (!isLoggedIn) {
        this.profileData = null;
        this.favoriteCars = [];
        this.router.navigate(['/login']);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.deleteConfirmTimeout) {
      clearTimeout(this.deleteConfirmTimeout);
    }
  }

  loadProfile() {
    this.userService.getMyProfile().subscribe({
      next: (data) => {
        this.profileData = data;
        if (
          this.profileData &&
          (this.profileData.contacts === undefined || this.profileData.contacts === null)
        ) {
          this.profileData.contacts = 0;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar el perfil del usuario:', err);
        this.toast.error('No se pudo cargar la información del perfil.', 'Error de conexión');
      },
    });
  }

  loadFavorites() {
    this.favoriteService.getMyFavorites().subscribe({
      next: (cars) => {
        this.zone.run(() => {
          this.favoriteCars = cars.map((car) => ({
            ...car,
            isSaved: true,
          }));

          this.cdr.detectChanges();
        });
      },
      error: (err) => {
        console.error('Error cargando favoritos', err);
      },
    });
  }

  removeFavorite(carId: number) {
    // Guardamos el estado original por si la petición falla
    const originalFavoriteCars = [...this.favoriteCars];

    this.favoriteCars = this.favoriteCars.filter((car) => car.id !== carId);

    // 2. Llamamos al servicio
    this.favoriteService.removeFavorite(carId).subscribe({
      next: () => {},
      // 3. En caso de error, revertimos la UI a su estado original y notificamos
      error: (err) => {
        console.error('No se pudo eliminar de favoritos', err);
        this.favoriteCars = originalFavoriteCars;
        this.toast.error(
          'No se pudo eliminar el vehículo de favoritos. Inténtalo de nuevo.',
          'Error',
        );
      },
    });
  }

  onDeleteAccount() {
    if (!this.isConfirmingDelete) {
      this.isConfirmingDelete = true;

      this.deleteConfirmTimeout = setTimeout(() => {
        this.zone.run(() => this.cancelDelete());
      }, 3000);
      return;
    }

    if (this.deleteConfirmTimeout) {
      clearTimeout(this.deleteConfirmTimeout);
    }

    this.userService.deleteAccount().subscribe({
      next: () => {
        this.toast.success('Tu cuenta ha sido eliminada correctamente.', 'Cuenta eliminada');
        this.authService.logout();
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Error al eliminar cuenta', err);
        this.toast.error('Hubo un problema al intentar eliminar tu cuenta.', 'Error');

        this.isConfirmingDelete = false;
      },
    });
  }

  cancelDelete() {
    this.isConfirmingDelete = false;
    if (this.deleteConfirmTimeout) {
      clearTimeout(this.deleteConfirmTimeout);
    }
  }

  get userInitial(): string {
    return this.profileData?.email ? this.profileData.email.charAt(0).toUpperCase() : 'U';
  }

  showDetails(id: number) {
    const encodedId = btoa(id.toString());
    this.router.navigate(['/detail-car', encodedId], {
      state: { listaFiltrada: this.favoriteCars },
    });
  }

  onLogout() {
    this.authService.logout();
    this.toast.success('Sesión cerrada correctamente', '¡Hasta pronto!');
    this.router.navigate(['/home']);
  }

  openChangePasswordModal() {
    this.isChangePasswordModalOpen = true;
  }

  closeChangePasswordModal() {
    this.isChangePasswordModalOpen = false;
  }
}
