import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { UserI, UserResponseI } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  constructor(
    private http: HttpClient,
    private router: Router
  ) { }
  
  get isLogged(): Observable<boolean>{
    return this.loggedIn.asObservable();
  }  
  private readonly TOKEN = 'token';
  login(user: UserI): Observable<UserResponseI | void> {
    return this.http.post<UserResponseI>(environment.baseUrl + '/auth/login', user)
      .pipe(
        map((user: UserResponseI) => {
          this.saveToken(user);
          this.loggedIn.next(true);
          return user;
        }
        ))

  }

  private saveToken(user: UserResponseI) {
    const { message, ...rest } = user;
    localStorage.setItem(this.TOKEN, JSON.stringify(rest.token).replace(/['"]+/g, ''));
    localStorage.setItem('user', JSON.stringify(rest));
  }

  logout():void {
    localStorage.removeItem(this.TOKEN);
    localStorage.removeItem('user');
    this.loggedIn.next(false);
    Swal.fire(
      'Good job!',
      'You clicked the button!',
      'success'
    )
    this.router.navigate(['/auth/login']);
  }

}
