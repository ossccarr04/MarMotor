import { Component, inject, signal, OnDestroy, Renderer2 } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { Header } from './module/components/common/header/header';
import { AuthServiceBBDD } from './module/services/auth-service';
import { filter } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

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
  private toast = inject(ToastrService);
  private renderer = inject(Renderer2);

  isServerSleeping = signal(false);
  serverReady = false;
  
  countdown = signal(90);
  serverMessage = signal('Contactando con el servidor...');
  private countdownInterval: any;

  mostrarHeader = signal(true);

  private globalClickListener: (() => void) | null = null;

  constructor() {
    this.wakeUpServer();

    this.router.events.pipe(
      filter((event): event is NavigationStart => event instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      if (!this.serverReady && event.url !== '/' && event.url !== '') {
        this.router.navigate(['/'], { replaceUrl: true });
        this.toast.info('Por favor, espere mientras se recogen los datos.', 'Servidor Iniciando');
      }
    });

    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      const rutasSinHeader = ['/auth/login', '/auth/register', '/auth/reset-password'];
      const rutaActualLimpia = event.urlAfterRedirects.split('?')[0];
      this.mostrarHeader.set(!rutasSinHeader.includes(rutaActualLimpia));
    });
  }

  wakeUpServer() {
    this.blockInteractions(); 


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
        this.unblockInteractions(); 
        clearTimeout(timeout);
      },
      error: () => {
        this.serverMessage.set('El servidor está tardando más de lo previsto...');
      }
    });
  }

  blockInteractions() {
    if (this.globalClickListener) return; // Ya está bloqueado

    this.globalClickListener = this.renderer.listen('document', 'click', (event: MouseEvent) => {
      if (!this.serverReady) {
        const target = event.target as HTMLElement;

        if (target.closest('a, button, [routerLink]')) {
          event.preventDefault();
          event.stopPropagation();
          this.toast.info('Por favor, espere mientras se recogen los datos.', 'Servidor Iniciando');
        }
      }
    }); 
  }

  unblockInteractions() {
    if (this.globalClickListener) {
      this.globalClickListener(); // Ejecuta la función de limpieza del listener
      this.globalClickListener = null;
    }
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
    this.stopCountdown(); 
    this.unblockInteractions(); 
  }
}