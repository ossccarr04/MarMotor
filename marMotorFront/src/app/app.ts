import { Component, inject, signal, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Header } from './module/components/common/header/header';
import { AuthServiceBBDD } from './module/services/auth-service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnDestroy {
  protected readonly title = signal('marMotor');
  private router = inject(Router);
  private authService = inject(AuthServiceBBDD);

  // Estados del servidor
  isServerSleeping = signal(false);
  serverReady = false;
  
  // Lógica de cuenta atrás
  countdown = signal(90);
  serverMessage = signal('Contactando con el servidor...');
  private countdownInterval: any;

  // Visibilidad del Header
  mostrarHeader = signal(true);

  constructor() {
    this.wakeUpServer();

    // Escuchar eventos de navegación para mostrar/ocultar el header de forma reactiva
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const rutasSinHeader = ['/auth/login', '/auth/register', '/auth/reset-password'];
      const rutaActualLimpia = event.urlAfterRedirects.split('?')[0];
      this.mostrarHeader.set(!rutasSinHeader.includes(rutaActualLimpia));
    });
  }

  wakeUpServer() {
    // Si a los 2 segundos no ha respondido, activamos el aviso y la cuenta atrás
    const timeout = setTimeout(() => {
      if (!this.serverReady) {
        this.isServerSleeping.set(true);
        this.startCountdown();
      }
    }, 2000); 

    this.authService.checkServerHealth().subscribe({
      next: () => {
        this.serverReady = true;
        this.isServerSleeping.set(false);
        this.stopCountdown();
        clearTimeout(timeout);
      },
      error: () => {
        // En caso de error crítico persistente
        this.serverMessage.set('El servidor está tardando más de lo previsto...');
      }
    });
  }

  startCountdown() {
    if (this.countdownInterval) return; // Evitar duplicados

    this.countdownInterval = setInterval(() => {
      this.countdown.update(val => (val > 0 ? val - 1 : 0));
      
      const current = this.countdown();
      
      // Cambiamos el mensaje según el tiempo restante
      if (current > 72) {
        this.serverMessage.set('Despertando el sistema de MarMotor...');
      } else if (current > 45) {
        this.serverMessage.set('Calentando motores y revisando inventario...');
      } else if (current > 18) {
        this.serverMessage.set('Casi listo, abriendo las puertas del concesionario...');
      } else if (current > 0) {
        this.serverMessage.set('Entrando en 3, 2, 1...');
      } else {
        this.serverMessage.set('Casi estamos, un segundo más...');
      }
    }, 1000);
  }

  stopCountdown() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  ngOnDestroy() {
    this.stopCountdown(); // Limpieza por seguridad
  }
}