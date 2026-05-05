import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from "@angular/router";
import { AuthServiceBBDD } from '../../../services/auth-service';
import { ToastrService } from 'ngx-toastr';
import { RegisterDTO } from '../../../../@types/interface/user.interface';
import { environment } from '../../../../../environments/environment.prod';

@Component({
  selector: 'app-register',
  standalone: true, // Asegúrate de tener esto
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registerForm: FormGroup;
  
  // Corregido: Las Regex en pattern() no deben ir entre comillas como string si quieres que funcionen bien
  regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  // Lista de correos protegidos (En un TFG real, esto vendría de environment.PROTECTED_EMAILS)
  // Por ahora lo simulamos con un array:

  passwordVisible: boolean = false;

  constructor(private fb: FormBuilder, private authService: AuthServiceBBDD, private toast: ToastrService, private router: Router) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [
        Validators.required, 
        Validators.email, 
        this.emailProtegidoValidator.bind(this) // Añadimos el validador de seguridad
      ]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(this.regexPassword)]],
      confirmPassword: ['', [Validators.required]]
    }, { 
      validators: [this.passwordsCoincidenValidator] 
    });
  }

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  get f() { return this.registerForm.controls; }

  // --- VALIDADORES PERSONALIZADOS ---

  // 1. Validador de Correos Protegidos/Existentes
  emailProtegidoValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value?.toLowerCase();
    if (environment.PROTECTED_EMAILS.includes(email)) {
      return { emailProtegido: true }; // Error personalizado
    }
    return null;
  }

  // 2. Validador de Coincidencia de Contraseñas
  passwordsCoincidenValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password !== confirmPassword && confirmPassword !== '') {
      const confirmControl = control.get('confirmPassword');
      confirmControl?.setErrors({ ...confirmControl.errors, noCoinciden: true });
      return { noCoinciden: true };
    }
    return null;
  }

  onSubmit() {
  if (this.registerForm.valid) {

    const userRegister: RegisterDTO = {
      username: this.registerForm.value.nombre,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password
    }

    this.authService.register(userRegister).subscribe({
      next: (data) => {
        this.toast.success('Registro exitoso. ¡Bienvenido a MarMotor!', '¡Enhorabuena!');
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 800);
      },
      error: (err) => {

        if (err.status === 403 || err.error?.code === environment.PROTECTED_EMAILS) {
          this.toast.error('No se ha podido completar el registro con los datos proporcionados. Por favor, verifica tu información o, si ya tienes una cuenta, intenta iniciar sesión.', 'Error de Seguridad');
          this.registerForm.get('email')?.setErrors({ emailProtegido: true });
        } else if (err.status === 409) {
          this.toast.warning('No se ha podido completar el registro con los datos proporcionados. Por favor, verifica tu información o, si ya tienes una cuenta, intenta iniciar sesión.', 'Aviso');
        } else {
          this.toast.error('No se pudo completar el registro. Inténtalo más tarde.', 'Error');
        }
      }
    });
  } else {
    this.toast.error('Por favor, revisa los campos en rojo.', 'Formulario inválido');
    this.registerForm.markAllAsTouched();
  }
}
}