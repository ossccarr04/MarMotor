import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.prod';


@Injectable({
  providedIn: 'root',
})
export class BodyTypeServiceBBDD {
  private http = inject(HttpClient);
  

  private readonly URL = `${environment.apiUrl}/api/body-types`;

  getAllBodyTypes(): Observable<any> {
    return this.http.get<any>(this.URL);
  }

  getActiveBodyTypes(isSold: boolean): Observable<any> {
    return this.http.get<any>(`${this.URL}/active?isSold=${isSold}`);
  }
}
