export interface RestaurantType {
  id: number;
  managerId: number;
  address: string;
  inProduction: boolean;
}

export interface ManagerType {
  id: number;
  name: string;
}

export interface RestaurantWithManager extends RestaurantType {
  managerName: string;
}

export type RestaurantTableColumn = 'id' | 'address' | 'manager' | 'inProduction';

export type RestaurantSortableColumn = Extract<RestaurantTableColumn, 'id' | 'address' | 'manager'>;
