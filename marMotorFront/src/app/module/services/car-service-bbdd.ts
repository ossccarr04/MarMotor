import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarDTO } from '../../@types/interface/car.interface';
import { environment } from '../../../environments/environment.development';
import { CarDetail } from '../../@types/interface/car-details.interface';


@Injectable({
  providedIn: 'root',
})
export class CarServiceBBDD {
  private http = inject(HttpClient);
  

  private readonly URL = `${environment.apiUrl}/cars`;

  getCars(): Observable<CarDTO[]> {
    return this.http.get<CarDTO[]>(this.URL);
  }


  getCarsByFilters(filtros: any | null): Observable<any[]> {
    let params = new HttpParams();

  if (filtros) {
    Object.keys(filtros).forEach(key => {

      params = params.append(key, filtros[key]);
    });
  }

  return this.http.get<any[]>(`${this.URL}/filters`, { params });
  }

  getCarsByCategory(categoria: string): Observable<any[]> {
    return this.http.get<CarDTO[]>(`${this.URL}/category/${categoria}`);
  }

  getCarsDetails(id: string | number): Observable<CarDetail> {
    return this.http.get<CarDetail>(`${this.URL}/${id}/detail`);
  }
}
