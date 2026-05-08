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

  getBrands(): Observable<any> {
    return this.http.get<any>(this.URL);
  }

  getBrandsSold(): Observable<any> {
    return this.http.get<any>(`${this.URL}/sold`);
  }
}
