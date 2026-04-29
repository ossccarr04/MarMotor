import { Component, ElementRef, HostListener, inject } from '@angular/core';
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

  toggleMenu(event: Event) {
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
