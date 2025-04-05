import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Manager, Restaurant } from '../models/restaurants.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private http = inject(HttpClient);

  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${environment.apiBaseUrl}/api/restaurants`);
  }

  getManagers(): Observable<Manager[]> {
    return this.http.get<Manager[]>(`${environment.apiBaseUrl}/api/managers`);
  }
}
