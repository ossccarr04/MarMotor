import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CarDTO } from '../../@types/interface/car.interface';
import { environment } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root',
})
export class FavoriteServiceBBDD {
  private http = inject(HttpClient);
  

  private readonly URL = `${environment.apiUrl}/api/users/me/favorites`;


  getMyFavorites(): Observable<CarDTO[]> {
    const favoriteCars= this.http.get<CarDTO[]>(this.URL);
    return favoriteCars;
  }

  getCars(): Observable<CarDTO[]> {
    return this.http.get<CarDTO[]>(this.URL);
  }

  // Añadir un coche a favoritos
  addFavorite(carId: number): Observable<void> {
    return this.http.post<void>(`${this.URL}/${carId}`, {});
  }

  // Eliminar un coche de favoritos
  removeFavorite(carId: number): Observable<void> {
    return this.http.delete<void>(`${this.URL}/${carId}`);
  }
  
}



