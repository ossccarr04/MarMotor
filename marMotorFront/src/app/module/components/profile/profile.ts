import { Component, inject } from '@angular/core';
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

  private favoriteService= inject(FavoriteServiceBBDD);
  private authService = inject(AuthServiceBBDD);
  private router = inject(Router);
  private toast = inject(ToastrService);

  favoriteCars: CarDTO[] = [];
  


  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites() {
    this.favoriteService.getMyFavorites().subscribe({
      next: (cars) => {
        this.favoriteCars = cars;
      },
      error: (err) => console.error('Error cargando favoritos', err)
    });
  }

  removeFavorite(carId: number) {
    this.favoriteService.removeFavorite(carId).subscribe({
      next: () => {
        // Optimistic update: lo quitamos del array local para que sea instantáneo
        this.favoriteCars = this.favoriteCars.filter(car => car.id !== carId);
      },
      error: (err) => console.error('No se pudo eliminar de favoritos', err)
    });
  }

  get userData() {
    return this.authService.getCurrentUser();
  }

  get userEmail(): string {
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
