import { ChangeDetectorRef, Component, ElementRef, HostListener, inject } from '@angular/core';
import { AuthServiceBBDD } from '../../../services/auth-service';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu-profile',
  imports: [RouterLink, CommonModule],
  templateUrl: './menu-profile.html',
  styleUrl: './menu-profile.scss',
})
export class Profile {
  
    private authService = inject(AuthServiceBBDD);
  private router = inject(Router);
  private toast = inject(ToastrService);
  private elementRef = inject(ElementRef);
  private cdr = inject(ChangeDetectorRef);
  
  isMenuOpen = false;

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

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.isMenuOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.isMenuOpen = false;
    }
  }

  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.verificarSesion();
  }

  verificarSesion(): void {
    // Si este componente está visible, se asume que la sesión estaba activa.
    // Comprobamos el estado real de la cookie.
    if (!this.authService.isLoggedIn()) {
      // Si la cookie ya no existe, hay una desincronización.
      // Forzamos el logout en el servicio. Esto notificará al Header
      // para que actualice su estado 'isLogged' a false y oculte este componente.
      console.log('Cookie no encontrada. Forzando actualización de estado.');
      this.authService.logout();
      this.cdr.detectChanges(); // Forzamos la detección de cambios para que la UI reaccione al instante.
    }
  }

  toggleMenu(event: Event) {
    this.verificarSesion(); // También es buena idea comprobarlo al hacer clic
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  onLogout() {
    this.authService.logout();
    this.isMenuOpen= false
    this.toast.success('Sesión cerrada correctamente', '¡Hasta pronto!');
    this.router.navigate(['/home']).then(() => {
      setTimeout(() => {
          window.location.reload();
        }, 800);
      
    });
  }
}
