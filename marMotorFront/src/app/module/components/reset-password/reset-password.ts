import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthServiceBBDD } from '../../services/auth-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword implements OnInit {

  resetPasswordForm!: FormGroup;
  token: string = '';
  
  showNewPassword = false;
  showConfirmPassword = false;

  isLoading: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  
  regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthServiceBBDD);
  private cdr = inject(ChangeDetectorRef);
  private fb = inject(FormBuilder);
  private toast = inject(ToastrService);

  ngOnInit(): void {
    this.resetPasswordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.regexPassword)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
      if (!this.token) {
        this.errorMessage = 'Enlace inválido. No se ha encontrado el código de seguridad.';
        this.resetPasswordForm.disable();
      }
    });
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    if (newPassword && confirmPassword && newPassword !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ noCoinciden: true });
      return { noCoinciden: true };
    }
    return null;
  }

  get f() { return this.resetPasswordForm.controls; }

  onSubmit() {
    if (this.resetPasswordForm.invalid) {
      this.toast.error('Por favor, revisa los campos del formulario.', 'Formulario inválido');
      this.resetPasswordForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const { newPassword } = this.resetPasswordForm.value;

    this.authService.resetPassword(this.token, newPassword).subscribe({
      next: (res) => {
        setTimeout(() => {
          this.successMessage = res.message;
          this.isLoading = false;
          this.resetPasswordForm.disable();
          this.cdr.detectChanges(); 
          this.toast.success(res.message, '¡Éxito!');
          setTimeout(() => this.router.navigate(['/auth/login']), 4000);
        }, 1500);
      },
      error: (err) => {
        setTimeout(() => {
          this.isLoading = false;
          this.errorMessage = err.error?.error || 'No se pudo cambiar la contraseña. El enlace puede haber caducado.';
          this.toast.error(this.errorMessage, 'Error');
          this.cdr.detectChanges();
        }, 1500);
      }
    });
  }
}
