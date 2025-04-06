import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestaurantTableComponent } from '../restaurant-table.component'
import { By } from '@angular/platform-browser';
import { Sort } from '@angular/material/sort';

@Component({
  selector: 'app-host',
  standalone: true,
  imports: [RestaurantTableComponent],
  template: `
    <app-restaurant-table
      [data]="data"
      [columns]="columns"
      (sortChange)="handleSort($event)"
    />
  `,
})
class TestHostComponent {
  data = [
    { id: 1, address: '123 Main St', managerName: 'Alice', inProduction: true },
    { id: 2, address: '456 Oak Ave', managerName: 'Bob', inProduction: false },
  ];
  columns = ['id', 'address', 'manager', 'inProduction'];
  emittedSort: Sort | null = null;

  handleSort(event: Sort) {
    this.emittedSort = event;
  }
}

describe('RestaurantTableComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(host).toBeTruthy();
    const table = fixture.debugElement.query(By.css('table'));
    expect(table).toBeTruthy();
  });

  it('should emit sortChange when sort header is clicked (manually triggered)', () => {
    const sortEvent: Sort = {
        active: 'address',
        direction: 'asc'
      };
      
      const table = fixture.debugElement.query(By.css('table'));
      table.triggerEventHandler('matSortChange', sortEvent);
      fixture.detectChanges();
      
      expect(host.emittedSort).toEqual(sortEvent);
  });
});
