import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { Header } from './module/components/common/header/header';
import { AuthServiceBBDD } from './module/services/auth-service';

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
  isServerSleeping = false;
  serverReady = false;
  constructor(private authService: AuthServiceBBDD) {}

  ngOnInit() {
    this.wakeUpServer();
  }

  wakeUpServer() {
    // Si a los 3 segundos no ha respondido, activamos el aviso
    const timeout = setTimeout(() => {
      if (!this.serverReady) {
        this.isServerSleeping = true;
      }
    }, 3000); 

    this.authService.checkServerHealth().subscribe({
      next: () => {
        this.serverReady = true;
        this.isServerSleeping = false;
        clearTimeout(timeout);
      },
      error: () => {
        // Si da error, quizás el servidor está realmente caído
        this.isServerSleeping = true; 
      }
    });
  }

  get mostrarHeader(): boolean {

    const rutasSinHeader = ['/auth/login', '/auth/register', '/auth/reset-password'];
    
    const rutaActualLimpia = this.router.url.split('?')[0];
    
    return !rutasSinHeader.includes(rutaActualLimpia);
  }
}
