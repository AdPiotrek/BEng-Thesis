import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserCredentials } from '../models/user-credentials';
import { map, tap } from 'rxjs/operators';
import { LoginResponse } from '../models/login-response';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../models/user';
import { RegisterData } from '../models/register-data';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  get token(): string {
    return localStorage.getItem('token')
  }

  constructor(private http: HttpClient) {
  }

  register(registerData: RegisterData) {
    return this.http.post<LoginResponse>(`${environment.restApiUrl}/api/register`, registerData)
      .pipe(
        tap((data: LoginResponse) => {
          localStorage.setItem('token', data.token)
        }),
        map((data: LoginResponse) => {
          return data.user
        })
      )
  }

  login(userCredentials: UserCredentials): Observable<User> {
    return this.http.post<LoginResponse>(`${environment.restApiUrl}/api/login`, userCredentials)
      .pipe(
        tap((data: LoginResponse) => {
          localStorage.setItem('token', data.token)
        }),
        map((data: LoginResponse) => {
          return data.user
        })
      )
  }

  refreshUser() {

  }

  logout() {
    localStorage.removeItem('token');
  }
}
