import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpResponse, HttpErrorResponse, HttpHandlerFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { authInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let toastrService: jasmine.SpyObj<ToastrService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    toastrService = jasmine.createSpyObj('ToastrService', ['error']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ToastrService, useValue: toastrService },
        { provide: Router, useValue: router },
      ],
    });
  });
  it('should handle missing token by showing toastr and navigating to login', () => {
    TestBed.runInInjectionContext(() => {
      spyOn(localStorage, 'getItem').and.returnValue(null);
  
      const req = new HttpRequest('GET', '/api/test');
      const next: HttpHandlerFn = (request) => of(new HttpResponse({ status: 200 }));
  
      const result = authInterceptor(req, next);
      result.subscribe(() => {
        expect(toastrService.error).toHaveBeenCalledWith('Authorization token missing! Please log in again.');
        expect(router.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });
  it('should show toastr error and navigate to login on 401 error', () => {
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/test');
      const next: HttpHandlerFn = () =>
        throwError(() => new HttpErrorResponse({ status: 401 }));
  
      const result = authInterceptor(req, next);
  
      result.subscribe({
        error: () => {
          expect(toastrService.error).toHaveBeenCalledWith('Authentication failed! Please log in again.');
  
          expect(router.navigate).toHaveBeenCalledWith(['/']);
        },
      });
    });
  });
  
  it('should add Authorization header if token is present and pass request to next handler', () => {
    TestBed.runInInjectionContext(() => {
      spyOn(localStorage, 'getItem').and.returnValue('valid-token');
  
      const req = new HttpRequest('GET', '/api/test');
      const next: HttpHandlerFn = (request) => of(new HttpResponse({ status: 200 }));
  
      const result = authInterceptor(req, next);
      result.subscribe((response) => {
        expect(response).toBeTruthy();
        expect(req.headers.get('Authorization')).toBe('Bearer valid-token');
      });
    });
  });
  
  it('should redirect to login if token is missing', () => {
    TestBed.runInInjectionContext(() => {
      spyOn(localStorage, 'getItem').and.returnValue(null);

      const req = new HttpRequest('GET', '/api/test');
      const next: HttpHandlerFn = (request) => of(new HttpResponse({ status: 200 }));

      const result = authInterceptor(req, next);
      result.subscribe(() => {
        expect(toastrService.error).toHaveBeenCalledWith('Authorization token missing! Please log in again.');
        expect(router.navigate).toHaveBeenCalledWith(['/']);
      });
    });
  });

  it('should handle 401 Unauthorized errors by showing toastr and navigating to login', () => {
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/test');
      const next: HttpHandlerFn = () =>
        throwError(() => new HttpErrorResponse({ status: 401 }));
  
      const result = authInterceptor(req, next);
      result.subscribe({
        error: () => {
          expect(toastrService.error).toHaveBeenCalledWith('Authentication failed! Please log in again.');
          expect(router.navigate).toHaveBeenCalledWith(['/']);
        },
      });
    });
  });
  
  it('should pass non-401 errors down the chain', () => {
    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/test');
      const next: HttpHandlerFn = () =>
        throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' }));
  
      const result = authInterceptor(req, next);
      result.subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('Internal Server Error');
        },
      });
    });
  });
  
  it('should handle server errors', () => {
    TestBed.runInInjectionContext(() => {
      spyOn(localStorage, 'getItem').and.returnValue('valid-token');

      const req = new HttpRequest('GET', '/api/test');
      const next: HttpHandlerFn = () =>
        throwError(() => new HttpErrorResponse({ status: 500 }));

      const result = authInterceptor(req, next);
      result.subscribe({
        error: (error) => {
          expect(error.status).toBe(500);
        },
      });
    });
  });
});
