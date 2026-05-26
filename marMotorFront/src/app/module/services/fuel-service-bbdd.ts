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

  getFuels(isSold?: boolean): Observable<any> {
    let urlFinal = this.URL;

    if (isSold !== undefined) {
      urlFinal = `${this.URL}/active?isSold=${isSold}`;
    }
    return this.http.get<any>(urlFinal);
  }
}
