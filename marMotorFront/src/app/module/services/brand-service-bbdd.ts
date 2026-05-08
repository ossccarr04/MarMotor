import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';



@Injectable({
  providedIn: 'root',
})
export class BrandServiceBBDD {
  private http = inject(HttpClient);
  

  private readonly URL = `${environment.apiUrl}/api/brands`;

  getAllBrands(): Observable<any> {
    return this.http.get<any>(this.URL);
  }

  /**
   * Obtiene solo las marcas de coches que están a la venta o vendidos.
   * NOTA: Esto requiere que el backend tenga un endpoint /api/brands/active?isSold=...
   */
  getActiveBrands(isSold: boolean): Observable<any> {
    return this.http.get<any>(`${this.URL}/active?isSold=${isSold}`);
  }
}
