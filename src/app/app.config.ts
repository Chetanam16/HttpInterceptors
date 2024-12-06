import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations'
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { provideHttpClient ,HTTP_INTERCEPTORS, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptor/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [provideAnimationsAsync(),provideHttpClient() ,provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideAnimations(),provideToastr(),
    provideHttpClient(withInterceptors([ authInterceptor]))
  ]
};


