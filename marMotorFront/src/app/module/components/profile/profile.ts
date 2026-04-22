import { Component, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { AuthServiceBBDD } from '../../services/auth-service';
import { CarDTO } from '../../../@types/interface/car.interface';
import { Router, RouterLink } from '@angular/router';
import { FavoriteServiceBBDD } from '../../services/favorite-service-bbdd';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  imports: [RouterLink, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile {
  private favoriteService = inject(FavoriteServiceBBDD);
  private authService = inject(AuthServiceBBDD);
  private router = inject(Router);
  private toast = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);


  favoriteCars: CarDTO[] = [];

  ngOnInit(): void {
    this.authService.authStatus$.subscribe(user => {
      if (user) {
        this.loadFavorites();
      }
    });
  }

  loadFavorites() {
    this.favoriteService.getMyFavorites().subscribe({
      next: (cars) => {
        this.zone.run(() => {
          this.favoriteCars = cars.map(car => ({
            ...car,
            isSaved: true 
          }));
          
          // Y por si acaso, le damos el doble toque de confirmación
          this.cdr.detectChanges(); 
        });
      },
      error: (err) => {
        console.error('Error cargando favoritos', err);
      }
    });
  }

  removeFavorite(carId: number) {
    // Guardamos el estado original por si la petición falla
    const originalFavoriteCars = [...this.favoriteCars];

    // 1. Actualización optimista: quitamos el coche de la lista local inmediatamente
    this.favoriteCars = this.favoriteCars.filter((car) => car.id !== carId);

    // 2. Llamamos al servicio
    this.favoriteService.removeFavorite(carId).subscribe({
      // En caso de éxito, no es necesario hacer nada porque la UI ya está actualizada.
      next: () => {},
      // 3. En caso de error, revertimos la UI a su estado original y notificamos
      error: (err) => {
        console.error('No se pudo eliminar de favoritos', err);
        this.favoriteCars = originalFavoriteCars; // Revertimos
        this.toast.error(
          'No se pudo eliminar el vehículo de favoritos. Inténtalo de nuevo.',
          'Error',
        );
      },
    });
  }

  get userData() {
    return this.authService.getCurrentUser();
  }

  get userEmail(): string {
    return this.userData ? atob(this.userData.correo) : '';
  }

  get userContact(): string {
    return this.userData ? atob(this.userData.correo) : '';
  }

  get userName(): string {
    return this.userData ? atob(this.userData.user) : '';
  }

  get userInitial(): string {
    return this.userEmail ? this.userEmail.charAt(0).toUpperCase() : 'U';
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
}
