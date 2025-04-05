import { inject, Injectable, computed, signal } from '@angular/core';
import {
  Restaurant,
  Manager,
  RestaurantWithManager,
  RestaurantSortableColumn,
} from '../../models/restaurants.model';
import { RestaurantService } from '../../core/restaurants.service';
import { SortDirection } from '@angular/material/sort';

@Injectable({ providedIn: 'root' })
export class RestaurantsStore {
  private readonly restaurantService = inject(RestaurantService);

  /**
   * STATE
   */
  private readonly allRestaurants = signal<Restaurant[]>([]);
  private readonly allManagers = signal<Manager[]>([]);

  readonly searchTerm = signal('');
  readonly pageIndex = signal(0);
  readonly pageSize = signal(25);
  readonly isLoading = signal(false);

  readonly sortColumn = signal<RestaurantSortableColumn>('id');
  readonly sortDirection = signal<SortDirection>('asc');

  /**
   * SELECTORS
   */

  // Map for faster lookup of manager names by ID
  private readonly managerNameMap = computed(() => {
    const map = new Map<number, string>();
    this.allManagers().forEach((m) => map.set(m.id, m.name));
    return map;
  });

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
    return this.visibleRestaurants().map((r) => ({
      ...r,
      managerName: managerMap.get(r.managerId) ?? 'N/A',
    }));
  });

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
  readonly load = async () => {
    this.isLoading.set(true);
    try {
      const [restaurants, managers] = await Promise.all([
        this.restaurantService.getRestaurants().toPromise(),
        this.restaurantService.getManagers().toPromise(),
      ]);

      this.allRestaurants.set(restaurants ?? []);
      this.allManagers.set(managers ?? []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      this.isLoading.set(false);
    }
  };

  /**
   * ACTIONS
   */
  setSearchTerm(value: string) {
    this.searchTerm.set(value);
    this.pageIndex.set(0); // reset page
  }

  setPage(index: number, size: number) {
    this.pageIndex.set(index);
    this.pageSize.set(size);
  }

  setSort(column: RestaurantSortableColumn) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }
}
