import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';


@Injectable({
  providedIn: 'root',
})
export class FuelTypeServiceBBDD {
  private http = inject(HttpClient);
  

  private readonly URL = `${environment.apiUrl}/api/fuel-types`;

  /**
   * Obtiene TODOS los tipos de combustible.
   */
  getAllFuels(): Observable<any> {
    return this.http.get<any>(this.URL);
  }

  getActiveFuels(isSold: boolean): Observable<any> {
    return this.http.get<any>(`${this.URL}/active?isSold=${isSold}`);
  }
}
