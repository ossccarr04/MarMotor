import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthServiceBBDD } from '../../../services/auth-service';
import { ForgotPassword } from '../../forgot-password/forgot-password';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription, timer, catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, RouterModule, ForgotPassword],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isForgotPasswordOpen = false;
  passwordVisible: boolean = false;

  isBlocked = false;
  blockTimeRemaining = 0;
  private countdownSubscription: Subscription | null = null;

  togglePassword(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  constructor(
    private fb: FormBuilder,
    private toast: ToastrService,
    private router: Router,
    private authService: AuthServiceBBDD,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]],
    });
  }
  ngOnInit(): void {
    this.checkExistingBlock();
  }

  ngOnDestroy(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  checkExistingBlock(): void {
    const blockExpiresAt = localStorage.getItem('loginBlockExpiresAt');
    if (blockExpiresAt) {
      const now = new Date().getTime();
      const expires = parseInt(blockExpiresAt, 10);
      if (now < expires) {
        this.isBlocked = true;
        this.startCountdown((expires - now) / 1000);
      } else {
        localStorage.removeItem('loginBlockExpiresAt');
      }
    }
  }

  startCountdown(seconds: number): void {
    this.blockTimeRemaining = Math.ceil(seconds);
    this.loginForm.disable();

    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }

    this.countdownSubscription = timer(0, 1000).subscribe(() => {
      if (this.blockTimeRemaining > 0) {
        this.blockTimeRemaining--;
      } else {
        this.isBlocked = false;
        this.loginForm.enable();
        localStorage.removeItem('loginBlockExpiresAt');
        if (this.countdownSubscription) {
          this.countdownSubscription.unsubscribe();
        }
      }
    });
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.blockTimeRemaining / 60);
    const seconds = this.blockTimeRemaining % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.toast.error('Por favor, introduce tus credenciales', 'Formulario incompleto');
      this.loginForm.markAllAsTouched();
      return;
    }
    if (this.isBlocked) {
      return;
    }

    this.authService
      .login(this.loginForm.value)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status === 429) {
            const blockDurationSeconds = 600; // 10 minutos
            const expiresAt = new Date().getTime() + blockDurationSeconds * 1000;
            localStorage.setItem('loginBlockExpiresAt', expiresAt.toString());
            this.startCountdown(blockDurationSeconds);
            this.toast.error(
              'Has realizado demasiados intentos fallidos. Por favor, espera 10 minutos.',
              'Acceso Bloqueado',
            );
          } else if (err.status === 401 || err.status === 403 || err.status === 409) {
            this.toast.error('Correo o contraseña incorrectos', 'Error de acceso');
          } else if (err.status === 404) {
            this.toast.error('El usuario no se encuentra registrado.', 'Error de acceso');
          } else {
            this.toast.error('Servidor no disponible. Inténtalo más tarde', 'Error de red');
          }
          return throwError(() => err);
        }),
      )
      .subscribe({
        next: (response) => {
          localStorage.removeItem('loginBlockExpiresAt');
          this.toast.success('Sesión iniciada correctamente', '¡Bienvenido de nuevo!');
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 800);
        },
      });
  }
}
