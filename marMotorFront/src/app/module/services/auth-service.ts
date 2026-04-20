import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { LoggedUserDTO, RegisterDTO } from '../../@types/interface/user.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceBBDD {
  private cookieService = inject(CookieService);

  private http = inject(HttpClient);

  private readonly URL = `${environment.apiUrl}/auth`;

  register(userRegister: RegisterDTO): Observable<any> {
    return this.http.post<any>(`${this.URL}/register`, userRegister);
  }

  getCurrentUser(): LoggedUserDTO | null {
    const token = this.cookieService.get('auth_token'); 

    if (!token) {
      return null;
    }

    try {
      const decoded: any = jwtDecode(token);

      return {
        id: btoa(decoded.id), // Codificar el ID en Base64
        rol: btoa(decoded.rol), // Codificar el rol en Base64
      } as LoggedUserDTO;
    } catch (error) {
      console.error('Token inválido o mal formado', error);
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.cookieService.check('auth_token');
  }
}
