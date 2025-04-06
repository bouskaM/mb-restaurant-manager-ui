import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RestaurantSearchComponent } from '../restaurant-search.component';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-host',
  standalone: true,
  imports: [RestaurantSearchComponent],
  template: `
    <app-restaurant-search
      [search]="search"
      (searchChange)="onSearchChange($event)"
    />
  `,
})
class TestHostComponent {
  search = 'pizza';
  emitted: string | null = null;

  onSearchChange(value: string) {
    this.emitted = value;
  }
}

describe('RestaurantSearchComponent', () => {
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

  it('should render the initial search input', () => {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('pizza');
  });

  it('should emit searchChange when input value changes', async () => {
    const inputDebug = fixture.debugElement.query(By.css('input'));
    const inputEl: HTMLInputElement = inputDebug.nativeElement;

    inputEl.value = 'burger';
    inputEl.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    // Angular needs a tick here for ngModelChange → so let's simulate it manually:
    inputDebug.triggerEventHandler('ngModelChange', 'burger');
    fixture.detectChanges();

    expect(host.emitted).toBe('burger');
  });
});
