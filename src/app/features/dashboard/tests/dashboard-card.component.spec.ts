import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardCardComponent } from '../dashboard-card.component';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

@Component({
  selector: 'app-host',
  template: `
    <app-dashboard-card
      [title]="title"
      [description]="description"
      [link]="link"
    />
  `,
  standalone: true,
  imports: [DashboardCardComponent],
})
class TestHostComponent {
  title = 'Restaurants';
  description = 'Manage restaurant list';
  link = '/restaurants';
}

describe('DashboardCardComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [provideRouter([])], // ✅ modern replacement
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should display title and description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h2')?.textContent).toBe('Restaurants');
    expect(compiled.querySelector('p')?.textContent).toBe('Manage restaurant list');
  });

  it('should bind routerLink to the mat-card', () => {
    const matCard = fixture.debugElement.query(By.css('mat-card'));
    const routerLink = matCard.attributes['ng-reflect-router-link'];
    expect(routerLink).toBe('/restaurants');
  });
});
