import { inject, Injectable, computed, signal } from '@angular/core';
import {
  RestaurantType,
  ManagerType,
  RestaurantWithManager,
  RestaurantSortableColumn,
} from '../../models/restaurants.model';
import { RestaurantService } from '../../core/restaurants.service';
import { SortDirection } from '@angular/material/sort';
import { firstValueFrom, forkJoin, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RestaurantsStore {
  private readonly restaurantService = inject(RestaurantService);

  /**
   * STATE
   */
  private readonly allRestaurants = signal<RestaurantType[]>([]);
  private readonly allManagers = signal<ManagerType[]>([]);

  readonly searchTerm = signal('');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(25);
  readonly isLoading = signal(false);
  readonly sortColumn = signal<RestaurantSortableColumn>('id');
  readonly sortDirection = signal<SortDirection>('asc');
  readonly error = signal<string | null>(null);

  /**
   * SELECTORS
   */

  // Map for faster lookup of manager names by ID
  private readonly managerNameMap = computed(() => {
    const map = new Map<number, string>();
    this.allManagers().forEach((m) => map.set(m.id, m.name));
    return map;
  });

  /** Restaurants filtered by search input */
  readonly filteredRestaurants = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const managerMap = this.managerNameMap();

    return this.allRestaurants().filter((r) => {
      const idMatch = r.id.toString().includes(search);
      const addressMatch = r.address.toLowerCase().includes(search);
      const managerMatch =
        managerMap.get(r.managerId)?.toLowerCase().includes(search) ?? false;

      return idMatch || addressMatch || managerMatch;
    });
  });

  /** Restaurants sorted by selected column and direction */
  readonly sortedRestaurants = computed(() => {
    const column = this.sortColumn();
    const direction = this.sortDirection();
    const managerMap = this.managerNameMap();

    return this.filteredRestaurants()
      .slice()
      .sort((a, b) => {
        let aValue: string | number = '';
        let bValue: string | number = '';

        switch (column) {
          case 'id':
            aValue = a.id;
            bValue = b.id;
            break;
          case 'address':
            aValue = a.address.toLowerCase();
            bValue = b.address.toLowerCase();
            break;
          case 'manager':
            aValue = managerMap.get(a.managerId)?.toLowerCase() ?? '';
            bValue = managerMap.get(b.managerId)?.toLowerCase() ?? '';
            break;
        }

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
      });
  });

  /** Paginated view of sorted restaurants */
  readonly visibleRestaurants = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.sortedRestaurants().slice(start, end);
  });

  /**
   * IMPORANT: This is the final computed property that combines the restaurant data with manager names
   * The computation is done only with the visible restaurants, which are already filtered and sorted and paginated
   * This is the final output that will be used in the UI
   */
  readonly paginatedRestaurantsWithManagerName = computed<
    RestaurantWithManager[]
  >(() => {
    const managerMap = this.managerNameMap();
    // add manager name to each restaurant in the visible list
    return this.visibleRestaurants().map((r) => ({
      ...r,
      managerName: managerMap.get(r.managerId) ?? 'N/A',
    }));
  });

  /** Total number of restaurants after filtering */
  readonly totalFilteredCount = computed(() => {
    const search = this.searchTerm().toLowerCase();
    const managerMap = this.managerNameMap();

    return this.allRestaurants().filter((r) => {
      const addressMatch = r.address.toLowerCase().includes(search);
      const idMatch = r.id.toString().includes(search);
      const managerName = managerMap.get(r.managerId)?.toLowerCase() ?? '';
      const managerMatch = managerName.includes(search);

      return addressMatch || idMatch || managerMatch;
    }).length;
  });

  /**
   * EFFECTS
   */
  /** Loads restaurants and managers from the API */
  readonly load = async () => {
    this.isLoading.set(true);
    this.error.set(null);
    try {
      const result = await firstValueFrom(
        // Wait for both API calls to complete
        // Assignmet node:
        // Restaurant Component is not loaded until we have data for restaurants & managers
        forkJoin([
          this.restaurantService.getRestaurants(),
          this.restaurantService.getManagers(),
        ]).pipe(map(([restaurants, managers]) => ({ restaurants, managers })))
      );

      this.allRestaurants.set(result.restaurants ?? []);
      this.allManagers.set(result.managers ?? []);
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred.';
      this.error.set(`Failed to load restaurant data: ${errorMessage}`);
    } finally {
      this.isLoading.set(false);
    }
  };

  /**
   * ACTIONS
   */

  /** Sets search term and resets pagination */
  setSearchTerm(value: string) {
    this.searchTerm.set(value);
    this.pageIndex.set(0);
  }

  /** Sets current page index and page size */
  setPage(index: number, size: number) {
    this.pageIndex.set(index);
    this.pageSize.set(size);
  }

  /** Sets the column to sort by and toggles direction if same column is clicked again */
  setSort(column: RestaurantSortableColumn) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }
}
