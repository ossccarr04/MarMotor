import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  registerForm: FormGroup;
  regexPassword= "/(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/"

  passwordVisible: boolean = false;

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)], Validators.pattern(this.regexPassword)],
      confirmPassword: ['', [Validators.required]]
    }, { 
      // Añadimos nuestro validador personalizado a nivel de todo el formulario

      validators: [
        this.passwordsCoincidenValidator
      ]
    });
  }

  get f() { return this.registerForm.controls; }

  // Validador personalizado para comprobar que las contraseñas son iguales
  passwordsCoincidenValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    // Si no coinciden y el campo no está vacío, lanzamos un error en 'confirmPassword'
    if (password !== confirmPassword && confirmPassword !== '') {
      control.get('confirmPassword')?.setErrors({ noCoinciden: true });
      return { noCoinciden: true };
    }
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
    } else {
      this.registerForm.markAllAsTouched();
    }
  }
}
