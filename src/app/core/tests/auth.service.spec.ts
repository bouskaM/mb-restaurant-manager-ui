import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { environment } from '../../../environments/environment';


describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiBaseUrl}/api/login`;

  beforeEach(() => {
    localStorage.clear();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should log in successfully and update login state', fakeAsync(() => {
    service.login('test', 'testpass');

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    req.flush({ token: 'abc' });

    tick();

    expect(service.isLoggedIn()).toBeTrue();
    expect(service.loginError()).toBeNull();
    expect(localStorage.getItem('isLoggedIn')).toBe('true');
  }));

  it('should set loginError on failed login', fakeAsync(() => {
    service.login('baduser', 'badpass');

    const req = httpMock.expectOne(apiUrl);
    req.flush({ message: 'Invalid' }, { status: 401, statusText: 'Unauthorized' });

    tick();

    expect(service.isLoggedIn()).toBeFalse();
    expect(service.loginError()).toBe('Invalid');
  }));

  it('should log out and clear login state', () => {
    localStorage.setItem('isLoggedIn', 'true');
    service.syncLoginStatus();
    expect(service.isLoggedIn()).toBeTrue();

    service.logout();

    expect(service.isLoggedIn()).toBeFalse();
    expect(service.loginError()).toBeNull();
    expect(localStorage.getItem('isLoggedIn')).toBeNull();
  });
});
