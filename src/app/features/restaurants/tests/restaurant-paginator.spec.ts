import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestaurantPaginatorComponent } from '../restaurant-paginator.component';
import { By } from '@angular/platform-browser';
import { PageEvent } from '@angular/material/paginator';
import { provideRouter } from '@angular/router';

@Component({
  selector: 'app-host',
  standalone: true,
  imports: [RestaurantPaginatorComponent],
  template: `
    <app-restaurant-paginator
      [length]="length"
      [pageSize]="pageSize"
      [pageIndex]="pageIndex"
      (pageChange)="handlePageChange($event)"
    />
  `,
})
class TestHostComponent {
  length = 100;
  pageSize = 25;
  pageIndex = 1;

  emittedEvent: PageEvent | null = null;
  handlePageChange(event: PageEvent) {
    this.emittedEvent = event;
  }
}

describe('RestaurantPaginatorComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let hostComponent: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the host and paginator component', () => {
    expect(hostComponent).toBeTruthy();
    const paginator = fixture.debugElement.query(By.css('mat-paginator'));
    expect(paginator).toBeTruthy();
  });

  it('should render correct input values', () => {
    const paginator = fixture.debugElement.query(By.css('mat-paginator'));
    expect(paginator.attributes['ng-reflect-length']).toBe('100');
    expect(paginator.attributes['ng-reflect-page-size']).toBe('25');
    expect(paginator.attributes['ng-reflect-page-index']).toBe('1');
  });

  it('should emit pageChange event', () => {
    const testEvent: PageEvent = {
      pageIndex: 2,
      previousPageIndex: 1,
      pageSize: 50,
      length: 100,
    };

    const paginator = fixture.debugElement.query(By.css('mat-paginator'));
    paginator.triggerEventHandler('page', testEvent);
    fixture.detectChanges();

    expect(hostComponent.emittedEvent).toEqual(testEvent);
  });
});
