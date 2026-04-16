import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarDTO } from '../../@types/interface/car.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FuelTypeServiceBBDD {
  private http = inject(HttpClient);
  

  private readonly URL = `${environment.apiUrl}/fuel-types`;

  getFuels(isSold?: boolean): Observable<any> {
  // Si isSold es true o false, lo añadimos como parámetro a la URL
  let urlFinal = this.URL;

  if (isSold !== undefined) {
    urlFinal = `${this.URL}/active?isSold=${isSold}`;
  }
  return this.http.get<any>(urlFinal);
}
}