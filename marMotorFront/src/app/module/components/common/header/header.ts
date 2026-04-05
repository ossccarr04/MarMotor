import { Component, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { filter } from 'rxjs';
import { isPlatformBrowser, CommonModule } from '@angular/common'; // Importante importar estos

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLinkActive, RouterLink, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isMenuOpen = false;
  isLogoZoomed: boolean = false;

  constructor(
    private renderer: Renderer2, 
    private router: Router, 
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Escuchamos los cambios de ruta para cerrar el menú automáticamente
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMenu(); 
    });
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    if (this.isMenuOpen) {
      // SOLO si estamos en el navegador podemos tocar el 'document'
      if (isPlatformBrowser(this.platformId)) {
        this.renderer.setStyle(document.body, 'overflow', 'hidden');
        // Te recomiendo quitar position fixed si te da problemas de scroll, 
        // pero si lo dejas, asegúrate de que esté aquí dentro.
        this.renderer.setStyle(document.body, 'position', 'fixed');
        this.renderer.setStyle(document.body, 'width', '100%');
        this.renderer.setStyle(document.body, 'height', '100%');
        this.renderer.setStyle(document.body, 'touch-action', 'none');
      }
    } else {
      this.closeMenu();
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    
    // Protección para el servidor
    if (isPlatformBrowser(this.platformId)) {
      this.renderer.removeStyle(document.body, 'overflow');
      this.renderer.removeStyle(document.body, 'position');
      this.renderer.removeStyle(document.body, 'width');
      this.renderer.removeStyle(document.body, 'height');
      this.renderer.removeStyle(document.body, 'touch-action');
    }
  }
}