import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Header } from './module/components/common/header/header';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('marMotor');

  private router = inject(Router);


  get mostrarHeader(): boolean {

    const rutasSinHeader = ['/auth/login', '/auth/register'];
    
    return !rutasSinHeader.includes(this.router.url);
  }
}
