import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Manager, Restaurant } from '../models/restaurants.model';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RestaurantService {
  private http = inject(HttpClient);

  // Assignment note:
  // For both restaurant and manager list, expect between 40000 - 100000 records

  // Fetches the list of restaurants from the API
  getRestaurants(): Observable<Restaurant[]> {
    return this.http.get<Restaurant[]>(`${environment.apiBaseUrl}/api/restaurants`);
  }

  // Fetches the list of managers from the API
  getManagers(): Observable<Manager[]> {
    return this.http.get<Manager[]>(`${environment.apiBaseUrl}/api/managers`);
  }
}
