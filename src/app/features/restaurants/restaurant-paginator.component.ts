import { Component, input, output } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-restaurant-paginator',
  standalone: true,
  imports: [CommonModule, MatPaginatorModule],
  template: `
    <mat-paginator
      [length]="length()"
      [pageSize]="pageSize()"
      [pageIndex]="pageIndex()"
      [pageSizeOptions]="[10, 25, 50, 100]"
      (page)="pageChange.emit($event)"
    >
    </mat-paginator>
  `,
})
export class RestaurantPaginatorComponent {
  length = input(0);
  pageSize = input(25);
  pageIndex = input(0);
  pageChange = output<PageEvent>();
}
