import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceBBDD } from '../../../services/auth-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  loginForm: FormGroup;

  passwordVisible: boolean = false;

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }
  

  constructor(
  private fb: FormBuilder,
  private toast: ToastrService,
  private router: Router,
  private authService: AuthServiceBBDD // Tu servicio de login
) {
  this.loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(1)]]
  });
}

  get f() { return this.loginForm.controls; }

  onSubmit() {
  if (this.loginForm.valid) {
     this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        // ÉXITO: Guardamos token y avisamos
        this.toast.success('Sesión iniciada correctamente', '¡Bienvenido de nuevo!');
        
        // Redirigimos al Home o Dashboard
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 800);
      },
      error: (err) => {
        if (err.status === 401 || err.status === 403 || err.status === 409) {
          this.toast.error('Correo o contraseña incorrectos', 'Error de acceso');
        } else if (err.status === 404) {
          // Aunque por seguridad no es ideal, se maneja el 404 como "usuario no encontrado".
          this.toast.error('El usuario no se encuentra registrado.', 'Error de acceso');
        } else {
          this.toast.error('Servidor no disponible. Inténtalo más tarde', 'Error de red');
        }
      }
    }); 
  } else {
    // Si el formulario no es válido al pulsar el botón
    this.toast.error('Por favor, introduce tus credenciales', 'Formulario incompleto');
    this.loginForm.markAllAsTouched();
  }
}
}
