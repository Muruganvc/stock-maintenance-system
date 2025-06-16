import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideZoneChangeDetection } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';
import { HTTP_INTERCEPTORS, withFetch, provideHttpClient } from '@angular/common/http'; 
import { GlobalErrorHandler } from './components/shared/services/GlobalErrorHandler';
import { HttpErrorInterceptor } from './components/shared/services/HttpErrorInterceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withFetch()), // Use fetch adapter (optional)
    provideToastr({
      positionClass: 'toast-bottom-right',
      timeOut: 3000,
    }),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true }
  ],
};
