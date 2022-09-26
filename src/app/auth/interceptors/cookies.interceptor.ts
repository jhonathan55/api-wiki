import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { throwError } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable()
export class CookiesInterceptor implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token')?.toString();
    console.log(token);
    if (token) {
      req = req.clone({
        headers: req.headers.set('token', token)
      });
      return next.handle(req).pipe(
        catchError(this.handlerError)
      );

    }

    return next.handle(req).pipe(
      catchError(this.handlerError)
      );
  }

  handlerError(error: HttpErrorResponse) {
    switch (error.status) {
      case 401:
        console.log('No autorizado');
        break;
      case 403:
        console.log('No autorizado');
        break;
      case 404:
        console.log('No autorizado');
        break;
      case 452:
        Swal.fire(
          'Error!',
          'Erroe en las credenciales!',
          'error'
        )
        break;
      case 500:
        console.log('No autorizado');
        break;
      default:
        Swal.fire(
          'Good job!',
          'Problemas con el server!',
          'success'
        )
        break;
    }
    return throwError(()=>error)
  }
}

export const AuthInterceptorProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: CookiesInterceptor,
  multi: true
}