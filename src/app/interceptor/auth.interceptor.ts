import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const toastr = inject(ToastrService);
  const router = inject(Router);

  const userToken = localStorage.getItem('authToken');
  if (userToken) {
    const modifiedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${userToken}`,
      },
    });
    return next(modifiedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          toastr.error('Authentication failed! Please log in again.');
          router.navigate(['/error']);
        }
        return throwError(() => error);
      })
    );
  } else {
    toastr.error('Authorization token missing! Please log in again.');
    router.navigate(['/error']);
    return next(req);
  }
};
