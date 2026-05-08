import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';
;


@Injectable({
  providedIn: 'root',
})
export class BodyTypeServiceBBDD {
  private http = inject(HttpClient);
  

  private readonly URL = `${environment.apiUrl}/api/body-types`;

  getBodyTypes(isSold?: boolean): Observable<any> {
    // Si isSold es true o false, lo añadimos como parámetro a la URL
    let urlFinal = this.URL;
  
    if (isSold !== undefined) {
      urlFinal = `${this.URL}/active?isSold=${isSold}`;
    }
    return this.http.get<any>(urlFinal);
  }
}
