import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from '../dashboard.component';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';

describe('DashboardComponent', () => {
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [provideRouter([])], // ✅ add this
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  it('should render dashboard title and section heading', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Dashboard');
    expect(compiled.querySelector('h2')?.textContent).toContain('Currently available modules');
  });

  it('should render one DashboardCardComponent', () => {
    const card = fixture.debugElement.query(By.css('app-dashboard-card'));
    expect(card).toBeTruthy();
  });

  it('should display DashboardCardComponent with correct title and description', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cardTitle = compiled.querySelector('app-dashboard-card h2')?.textContent;
    const cardDescription = compiled.querySelector('app-dashboard-card p')?.textContent;
  
    expect(cardTitle).toBe('Restaurants');
    expect(cardDescription).toBe('Manage and view all restaurants');
  });
  
});
