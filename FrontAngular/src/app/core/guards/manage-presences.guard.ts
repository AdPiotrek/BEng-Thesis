import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CourseService } from '../../authorized/user/services/course.service';
import { AlertService } from '../services/alert.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class ManagePresencesGuard implements CanActivate {

  constructor(private courseService: CourseService,
              private alertService: AlertService,
              private router: Router,
              private userService: UserService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const choosedCourse = this.courseService.choosedCourse;

    if (!!choosedCourse) {
      return true;
    }

    this.alertService.newAlert('Aby zarządzać obecnościami, najpierw wybierz kurs', 'info', 5000);
    this.router.navigate([`/u/${this.userService.loggedUser._id}/courses`]);
    return false;
  }
}
