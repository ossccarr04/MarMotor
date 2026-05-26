import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthServiceBBDD } from '../../services/auth-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  @Output() close = new EventEmitter<void>();

  email: string = '';
  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  countdown: number = 0;
  timerInterval: any;

  private authService = inject(AuthServiceBBDD);
  private toast = inject(ToastrService);
  private cdr = inject(ChangeDetectorRef);

  onSubmit() {
    if (!this.email) return;

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.authService.forgotPassword(this.email).subscribe({
      next: (response) => {
        setTimeout(() => {
          this.isLoading = false;
          this.successMessage = response.message;
          this.toast.success('Enlace de recuperación enviado. Revisa tu correo.', '¡Éxito!');
          this.startCountdown();
        }, 2000);
      },
      error: (err) => {
        setTimeout(() => {
          console.error('Error enviando el correo', err);
          this.isLoading = false;

          this.toast.error(
            'Error enviando el correo, revisa la bandeja de entrada o spam',
            'Error',
          );

          if (err.error && err.error.error) {
            this.errorMessage = err.error.error;
          } else {
            this.errorMessage =
              'Ha habido un error. Revisa tu bandeja de entrada o inténtalo de nuevo en 15 minutos.';
          }
          this.cdr.detectChanges();
        }, 2000);
      },
    });
  }

  onClose() {
    if (this.isLoading) {
      return;
    }
    this.close.emit();
  }

  startCountdown() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    this.countdown = 10;
    this.cdr.detectChanges();

    this.timerInterval = setInterval(() => {
      this.countdown--;

      this.cdr.detectChanges();

      if (this.countdown <= 0) {
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }
}
