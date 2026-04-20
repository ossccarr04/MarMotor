import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { CarDTO } from '../../@types/interface/car.interface';
import { CarDetail } from '../../@types/interface/car-details.interface';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CarServiceBBDD {
  private http = inject(HttpClient);

  private readonly URL = `${environment.apiUrl}/cars`;
  mantenerVendidosActivo: boolean = false;
  private carIdsSource = new BehaviorSubject<number[]>([]);
  public recargarCoches$ = new Subject<void>();

  currentCarIds = this.carIdsSource.asObservable();

  setCarIds(ids: number[]) {
    this.carIdsSource.next(ids);
  }

  getCarIds() {
    return this.carIdsSource.value;
  }

  getCarsByModel(query: string): Observable<CarDTO[]> {
    return this.http.get<CarDTO[]>(`${this.URL}/search/admin`, {
      params: { query },
    });
  }

  getCars(): Observable<CarDTO[]> {
    return this.http.get<CarDTO[]>(this.URL);
  }

  getCarsByFilters(filtros: any | null): Observable<any[]> {
    let params = new HttpParams();

    if (filtros) {
      Object.keys(filtros).forEach((key) => {
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

  getCarById(id: string | number): Observable<CarDTO> {
    return this.http.get<CarDTO>(`${this.URL}/${id}`);
  }

  createCarWithImages(formData: FormData): Observable<any> {
    return this.http.post<any>(this.URL, formData);
  }

  updateCar(id: string, formData: FormData): Observable<CarDTO> {
    return this.http.put<CarDTO>(`${this.URL}/${id}`, formData);
  }
  
  deleteCar(id: number): Observable<any> {
    return this.http.delete<any>(`${this.URL}/${id}`);
  }
}
