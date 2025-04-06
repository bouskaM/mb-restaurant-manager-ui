import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['login', 'isLoggedIn', 'loginError']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        CommonModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should disable login button when fields are empty', () => {
    component.username.set('');
    component.password.set('');
    fixture.detectChanges();
    expect(component.isFormValid()).toBeFalse();
  });

  it('should enable login button when fields are filled', () => {
    component.username.set('user');
    component.password.set('pass');
    fixture.detectChanges();
    expect(component.isFormValid()).toBeTrue();
  });

  it('should call authService.login with entered username and password', async () => {
    component.username.set('user');
    component.password.set('pass');
    mockAuthService.login.and.returnValue(Promise.resolve());
    mockAuthService.isLoggedIn.and.returnValue(false);

    await component.login();

    expect(mockAuthService.login).toHaveBeenCalledWith('user', 'pass');
  });

  it('should navigate to dashboard if login is successful', async () => {
    component.username.set('user');
    component.password.set('pass');
    mockAuthService.login.and.returnValue(Promise.resolve());
    mockAuthService.isLoggedIn.and.returnValue(true);

    await component.login();

    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show error message from authService', () => {
    // FIXED: set this BEFORE detectChanges()
    mockAuthService.loginError.and.returnValue('Invalid credentials');
    fixture.detectChanges();
    expect(component.error()).toBe('Invalid credentials');
  });

  it('should auto-redirect if already logged in', fakeAsync(() => {
    mockAuthService.isLoggedIn.and.returnValue(true);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    tick(500); // simulate time passing
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  }));
});
