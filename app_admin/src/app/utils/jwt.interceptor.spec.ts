import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpHandler, HttpEvent, HttpResponse } from '@angular/common/http';
import { JwtInterceptor } from './jwt.interceptor';
import { AuthenticationService } from '../services/authentication.service';
import { of } from 'rxjs';

describe('JwtInterceptor', () => {
  let interceptor: JwtInterceptor;
  let authServiceMock: Partial<AuthenticationService>;

  beforeEach(() => {
    authServiceMock = {
      isLoggedIn: () => true,
      getToken: () => 'fake-token'
    };

    TestBed.configureTestingModule({
      providers: [
        JwtInterceptor,
        { provide: AuthenticationService, useValue: authServiceMock }
      ]
    });

    interceptor = TestBed.inject(JwtInterceptor);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should attach Authorization header if logged in and not login/register', (done) => {
    const request = new HttpRequest<any>('GET', '/api/data');
    const next: HttpHandler = {
      handle: (req: HttpRequest<any>) => {
        expect(req.headers.get('Authorization')).toBe('Bearer fake-token');
        return of(new HttpResponse({ status: 200 })); // ✅ proper HttpEvent
      }
    };

    interceptor.intercept(request, next).subscribe(() => done());
  });

  it('should not attach Authorization header for login URL', (done) => {
    const request = new HttpRequest<any>('POST', '/login', {}); // ✅ include empty body
    const next: HttpHandler = {
      handle: (req: HttpRequest<any>) => {
        expect(req.headers.has('Authorization')).toBeFalse();
        return of(new HttpResponse({ status: 200 })); // ✅ proper HttpEvent
      }
    };

    interceptor.intercept(request, next).subscribe(() => done());
  });

  it('should not attach Authorization header for register URL', (done) => {
    const request = new HttpRequest<any>('POST', '/register', {}); // ✅ include empty body
    const next: HttpHandler = {
      handle: (req: HttpRequest<any>) => {
        expect(req.headers.has('Authorization')).toBeFalse();
        return of(new HttpResponse({ status: 200 })); // ✅ proper HttpEvent
      }
    };

    interceptor.intercept(request, next).subscribe(() => done());
  });
});