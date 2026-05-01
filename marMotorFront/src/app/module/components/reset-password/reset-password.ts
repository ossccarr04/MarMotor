import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthServiceBBDD } from '../../services/auth-service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {

  token: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  
  showNewPassword = false;
  showConfirmPassword = false;

  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  passwordMismatch: boolean = false;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthServiceBBDD);
  private cdr = inject(ChangeDetectorRef);

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.errorMessage = 'Enlace inválido. No se ha encontrado el código de seguridad.';
      }
    });
  }

  onSubmit() {
    this.errorMessage = '';
    this.passwordMismatch = false;

    if (this.newPassword !== this.confirmPassword) {
      this.passwordMismatch = true;
      return;
    }

    this.isLoading = true; // Empieza el "Guardando..."

    this.authService.resetPassword(this.token, this.newPassword).subscribe({
      next: (res) => {

        setTimeout(() => {
          this.successMessage = res.message;
          this.isLoading = false;
          
          this.cdr.detectChanges(); 

          setTimeout(() => this.router.navigate(['/auth/login']), 4000);
        }, 1500);
      },
      error: (err) => {
        setTimeout(() => {
          this.errorMessage = err.error?.error || 'No se pudo cambiar la contraseña. El enlace puede haber caducado.';
          this.isLoading = false; 
          
          this.cdr.detectChanges();
        }, 1500);
      }
    });
  }
}

