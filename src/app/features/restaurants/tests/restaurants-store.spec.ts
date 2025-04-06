import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RestaurantsStore } from '../restaurants.store';
import { RestaurantService } from '../../../core/restaurants.service';
import { fakeAsync, tick } from '@angular/core/testing';

describe('RestaurantsStore', () => {
  let store: RestaurantsStore;
  let serviceSpy: jasmine.SpyObj<RestaurantService>;

  beforeEach(() => {
    serviceSpy = jasmine.createSpyObj('RestaurantService', ['getRestaurants', 'getManagers']);

    serviceSpy.getRestaurants.and.returnValue(of([
      { id: 1, address: '123 Main St', managerId: 1, inProduction: true },
      { id: 2, address: '456 Oak Ave', managerId: 2, inProduction: false }
    ]));

    serviceSpy.getManagers.and.returnValue(of([
      { id: 1, name: 'Alice' },
      { id: 2, name: 'Bob' }
    ]));

    TestBed.configureTestingModule({
      providers: [
        { provide: RestaurantService, useValue: serviceSpy },
        RestaurantsStore
      ]
    });

    store = TestBed.inject(RestaurantsStore);
  });

  it('should initialize with default state', () => {
    expect(store.pageIndex()).toBe(0);
    expect(store.pageSize()).toBe(25);
    expect(store.isLoading()).toBe(false);
  });

  it('should load restaurants and managers successfully', fakeAsync(async () => {
    await store.load();
    tick();

    expect(store.isLoading()).toBe(false);
    expect(store.paginatedRestaurantsWithManagerName()).toEqual([
      { id: 1, address: '123 Main St', managerId: 1, managerName: 'Alice', inProduction: true },
      { id: 2, address: '456 Oak Ave', managerId: 2, managerName: 'Bob', inProduction: false },
    ]);
    expect(store.error()).toBeNull();
  }));

  it('should handle load failure and set error', fakeAsync(async () => {
    serviceSpy.getRestaurants.and.returnValue(throwError(() => new Error('API down')));
    serviceSpy.getManagers.and.returnValue(of([]));

    await store.load();
    tick();

    expect(store.isLoading()).toBe(false);
    expect(store.error()).toContain('Failed to load restaurant data');
  }));

  it('should set search term and reset page index', () => {
    store.pageIndex.set(3);
    store.setSearchTerm('main');

    expect(store.searchTerm()).toBe('main');
    expect(store.pageIndex()).toBe(0);
  });

  it('should update pagination', () => {
    store.setPage(2, 50);
    expect(store.pageIndex()).toBe(2);
    expect(store.pageSize()).toBe(50);
  });

  it('should sort restaurants by address ascending then toggle to descending', () => {
    store.setSort('address');
    expect(store.sortColumn()).toBe('address');
    expect(store.sortDirection()).toBe('asc');

    store.setSort('address');
    expect(store.sortDirection()).toBe('desc');
  });

  it('should switch sort column and reset direction to asc', () => {
    store.setSort('manager');
    expect(store.sortColumn()).toBe('manager');
    expect(store.sortDirection()).toBe('asc');
  });
});