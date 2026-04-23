import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserServiceBBDD } from '../../services/user-service-bbdd';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss',
})
export class ChangePassword implements OnInit {
  @Output() close = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private toast = inject(ToastrService);
  private userService = inject(UserServiceBBDD);

  changePasswordForm!: FormGroup;
  passwordVisible = false;
  isSubmitting = false;
  regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  ngOnInit(): void {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.regexPassword)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
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

  get f() {
    return this.changePasswordForm.controls;
  }

  togglePassword() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    if (this.changePasswordForm.invalid) {
      this.toast.error('Por favor, revisa los campos del formulario.', 'Error de validación');
      return;
    }

    this.isSubmitting = true;
    const { currentPassword, newPassword } = this.changePasswordForm.value;

    this.userService.changePassword({ currentPassword, newPassword }).subscribe({
      next: () => {
        this.toast.success('Contraseña actualizada con éxito.', 'Éxito');
        this.isSubmitting = false;
        this.close.emit();
      },
      error: (err) => {
        this.isSubmitting = false;
        const errorMessage = err.error?.message || 'No se pudo cambiar la contraseña. Verifica tu contraseña actual.';
        this.toast.error(errorMessage, 'Error');
      }
    });
  }
}
