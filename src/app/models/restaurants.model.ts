export interface Restaurant {
  id: number;
  managerId: number;
  address: string;
  inProduction: boolean;
}

export interface Manager {
  id: number;
  name: string;
}

export interface RestaurantWithManager extends Restaurant {
  managerName: string;
}

export type RestaurantTableColumn = 'id' | 'address' | 'manager' | 'inProduction';

export type RestaurantSortableColumn = Extract<RestaurantTableColumn, 'id' | 'address' | 'manager'>;
