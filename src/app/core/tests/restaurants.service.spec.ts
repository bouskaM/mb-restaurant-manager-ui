import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { RestaurantService } from '../restaurants.service';
import { environment } from '../../../environments/environment';
;

describe('RestaurantService', () => {
  let service: RestaurantService;
  let httpMock: HttpTestingController;

  const mockRestaurants = [
    { id: 1, address: '123 Main St', managerId: 1, inProduction: true },
    { id: 2, address: '456 Oak Ave', managerId: 2, inProduction: false },
  ];

  const mockManagers = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        RestaurantService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });

    service = TestBed.inject(RestaurantService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch restaurants from API', () => {
    service.getRestaurants().subscribe(restaurants => {
      expect(restaurants).toEqual(mockRestaurants);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/restaurants`);
    expect(req.request.method).toBe('GET');
    req.flush(mockRestaurants);
  });

  it('should fetch managers from API', () => {
    service.getManagers().subscribe(managers => {
      expect(managers).toEqual(mockManagers);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/api/managers`);
    expect(req.request.method).toBe('GET');
    req.flush(mockManagers);
  });
});
