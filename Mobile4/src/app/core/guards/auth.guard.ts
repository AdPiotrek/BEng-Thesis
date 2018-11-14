import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService,
              private router: Router){
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

    if(this.isUserLogged()) {
      return true;
    }

    const loggedUser = JSON.parse(localStorage.getItem('user'));

    if (!!loggedUser) {
      this.userService.loggedUser = loggedUser;
      return true;
    }

    this.router.navigate(['/login']);
    return false;

  }

  isUserLogged(): boolean {
    return !!this.userService.loggedUser
  }
}
