// /app/utils/jwt.interceptor.ts
import { Injectable, Provider } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Determine if the request is for login or register endpoints
    const isAuthAPI = request.url.startsWith('login') || request.url.startsWith('register');

    // If the user is logged in and not calling login/register, attach the JWT token
    if (this.authenticationService.isLoggedIn() && !isAuthAPI) {
      const token = this.authenticationService.getToken();
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }

    // Otherwise, continue with the original request
    return next.handle(request);
  }
}

// Export a provider to wire the interceptor into Angular's HTTP pipeline
export const authInterceptProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true
};
