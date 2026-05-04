import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';



@Injectable({
  providedIn: 'root',
})
export class UserServiceBBDD {
  private http = inject(HttpClient);
  

  private readonly URL = `${environment.apiUrl}/api/users`;

  getMyProfile(): Observable<any> {
    return this.http.get<any>(`${this.URL}/me`);
  }

  changePassword(passwords: { currentPassword: string, newPassword: string }): Observable<any> {
    return this.http.patch<any>(`${this.URL}/me/password`, passwords);
  }

  deleteAccount(): Observable<any> {
    return this.http.delete<any>(`${this.URL}/me`);
  }
}