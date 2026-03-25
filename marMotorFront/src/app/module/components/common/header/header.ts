import { Component, inject, Renderer2 } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLinkActive, RouterLink, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  isMenuOpen = false;
  isLogoZoomed: boolean = false;

  constructor(private renderer: Renderer2) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;

    // Si el menú está abierto, añadimos la clase al body, si no, la quitamos
    if (this.isMenuOpen) {
      this.renderer.setStyle(document.body, 'overflow', 'hidden');
    this.renderer.setStyle(document.body, 'position', 'fixed');
    this.renderer.setStyle(document.body, 'width', '100%');
    this.renderer.setStyle(document.body, 'height', '100%');
    this.renderer.setStyle(document.body, 'touch-action', 'none');
    } else {
      this.closeMenu()
    }
  }

  // Función para cerrar el menú (úsala en los enlaces <a>)
  closeMenu() {
    this.isMenuOpen = false;
  // Quitamos el estilo y devolvemos la posición normal
  this.renderer.removeStyle(document.body, 'overflow');
  this.renderer.removeStyle(document.body, 'position');
  this.renderer.removeStyle(document.body, 'width');
  this.renderer.removeStyle(document.body, 'height');
  this.renderer.removeStyle(document.body, 'touch-action');
  }
}
