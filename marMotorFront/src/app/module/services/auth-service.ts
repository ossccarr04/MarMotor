import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarDTO } from '../../@types/interface/car.interface';
import { environment } from '../../../environments/environment.development';
import { RegisterDTO } from '../../@types/interface/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceBBDD {
  private http = inject(HttpClient);
  

  private readonly URL = `${environment.apiUrl}/auth`;

  register(userRegister: RegisterDTO): Observable<any> {
    return this.http.post<any>(`${this.URL}/register`, userRegister);
  }
}