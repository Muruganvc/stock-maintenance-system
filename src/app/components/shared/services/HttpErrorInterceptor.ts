import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('[HTTP Error]', error);
        let message = 'An unknown error occurred';

        if (error.error instanceof ErrorEvent) {
          message = `Client-side error: ${error.error.message}`;
        } else {
          message = `Server returned code ${error.status}, message: ${error.message}`;
        }

        this.toastr.error(message, 'HTTP Error');
        return throwError(() => error);
      })
    );
  }
}
