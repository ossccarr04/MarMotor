import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { LoggedUserDTO, LoginDTO, RegisterDTO } from '../../@types/interface/user.interface';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceBBDD {
  private cookieService = inject(CookieService);

  private http = inject(HttpClient);
  private readonly URL = `${environment.apiUrl}/auth`;

  private authStatus = new BehaviorSubject<boolean>(this.isLoggedIn());
  authStatus$ = this.authStatus.asObservable();

  checkServerHealth() {
  return this.http.get(`${this.URL}/public/health`, { responseType: 'text' });
}

  getCurrentUser(): LoggedUserDTO | null {
    const token = this.cookieService.get('access_token'); 

    if (!token) {
      return null;
    }

    try {
      const decoded: any = jwtDecode(token);
      return {
        user: btoa(decoded.user),
        correo: btoa(decoded.sub), // Codificar el ID en Base64
        role: btoa(decoded.role), // Codificar el rol en Base64
      } as LoggedUserDTO;
    } catch (error) {
      console.error('Token inválido o mal formado', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.cookieService.check('access_token');
  }
  
  register(userRegister: RegisterDTO): Observable<any> {
    return this.http.post<any>(`${this.URL}/register`, userRegister);
  }

  login(userLogin: LoginDTO): Observable<any> {
    return this.http.post<any>(`${this.URL}/login`, userLogin).pipe(
      tap({
        next: (response) => {
          const token = response?.access_token || response?.token;
          if (token) {
            this.cookieService.set('access_token', token, 1, '/');
            this.authStatus.next(true);
          }
        },
      })
    );
  }

  logout() {
    this.cookieService.delete('access_token', '/');
    this.authStatus.next(false);
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post<any>(`${this.URL}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post<any>(`${this.URL}/reset-password`, { token, newPassword });
  }
}
