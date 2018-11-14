import { Injectable } from '@angular/core';
import {User} from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _loggedUser: User;

  set loggedUser(user: User) {
    localStorage.setItem('user', JSON.stringify(user));
    this._loggedUser = user;
  }

  get loggedUser() {
    return this._loggedUser;
  }

  get userRole() {
    return this._loggedUser.role;
  }

  constructor() { }

  logoutUser() {

  }

  isInstructor() {
    return this.userRole === 'instructor';
  }

  isCommonUser() {
    return this.userRole === 'user';
  }
}
