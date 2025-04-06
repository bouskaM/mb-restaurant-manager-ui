import { ComponentFixture, TestBed } from '@angular/core/testing';

import { By } from '@angular/platform-browser';
import { RestaurantLoaderComponent } from '../restaurant-loader.component';

describe('RestaurantLoaderComponent', () => {
  let fixture: ComponentFixture<RestaurantLoaderComponent>;
  let component: RestaurantLoaderComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantLoaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RestaurantLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render a mat-spinner', () => {
    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should render loading text', () => {
    const text = fixture.nativeElement.querySelector('p')?.textContent;
    expect(text?.trim()).toBe('Loading restaurants...');
  });
});
