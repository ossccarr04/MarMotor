import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  loginForm: FormGroup;

  passwordVisible: boolean = false;

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }
  

  constructor(private fb: FormBuilder) {
    // Definimos los campos y sus validaciones preventivas
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log('Enviando datos al backend:', this.loginForm.value);
      // Aquí llamarías a tu servicio de autenticación
    } else {
      // Si el usuario le da a "Entrar" sin rellenar, marcamos todo en rojo
      this.loginForm.markAllAsTouched();
    }
  }
}
