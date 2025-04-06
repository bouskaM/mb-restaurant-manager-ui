import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestaurantsComponent } from '../restaurants.component';
import { RestaurantsStore } from '../restaurants.store';
import { computed, signal } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';

describe('RestaurantsComponent', () => {
  let fixture: ComponentFixture<RestaurantsComponent>;
  let store: jasmine.SpyObj<RestaurantsStore>;

  beforeEach(async () => {
    store = jasmine.createSpyObj<RestaurantsStore>(
      'RestaurantsStore',
      ['load', 'setSearchTerm', 'setPage', 'setSort'],
      {
        paginatedRestaurantsWithManagerName: computed(() => [
          {
            id: 1,
            address: '123 Main St',
            managerId: 1,
            managerName: 'Alice',
            inProduction: true,
          },
          {
            id: 2,
            address: '456 Oak Ave',
            managerId: 2,
            managerName: 'Bob',
            inProduction: false,
          }
        ]),
        pageIndex: signal(0),
        pageSize: signal(25),
        totalFilteredCount: signal(2),
        isLoading: signal(false),
        error: signal(''),
        searchTerm: signal(''),
        sortDirection: signal<'asc' | 'desc'>('asc'),
      }
    );
    store.sortDirection.set = jasmine.createSpy();

    await TestBed.configureTestingModule({
      imports: [RestaurantsComponent],
      providers: [{ provide: RestaurantsStore, useValue: store }],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantsComponent);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should show title and children components', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('h1')?.textContent).toContain('Restaurants');
    expect(el.querySelector('app-restaurant-search')).toBeTruthy();
    expect(el.querySelector('app-restaurant-table')).toBeTruthy();
    expect(el.querySelector('app-restaurant-paginator')).toBeTruthy();
  });

  it('should show loader when isLoading is true', () => {
    store.isLoading.set(true);
    fixture.detectChanges();

    const loader = fixture.nativeElement.querySelector('app-restaurant-loader');
    expect(loader).toBeTruthy();

    const table = fixture.nativeElement.querySelector('app-restaurant-table');
    expect(table).toBeFalsy();
  });

  it('should display error message if error is set', () => {
    store.error.set('Something went wrong');
    fixture.detectChanges();

    const errorMsg = fixture.nativeElement.querySelector('.error-msg');
    expect(errorMsg?.textContent).toContain('Something went wrong');
  });

  it('should call setSearchTerm on searchChange', () => {
    fixture.componentInstance.onSearchChange('pizza');
    expect(store.setSearchTerm).toHaveBeenCalledWith('pizza');
  });

  it('should call setPage on pageChange', () => {
    const event: PageEvent = {
      pageIndex: 2,
      pageSize: 50,
      previousPageIndex: 1,
      length: 200,
    };
    fixture.componentInstance.onPageChange(event);
    expect(store.setPage).toHaveBeenCalledWith(2, 50);
  });

  it('should call setSort and set sortDirection on sortChange', () => {
    const sort: Sort = { active: 'manager', direction: 'desc' };
    fixture.componentInstance.sortChange(sort);

    expect(store.setSort).toHaveBeenCalledWith('manager');
    expect(store.sortDirection.set).toHaveBeenCalledWith('desc');
  });
});
