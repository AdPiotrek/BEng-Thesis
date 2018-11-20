import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {CourseService} from "../services/course.service";
import {UserService} from "../services/user.service";
import {ToastController} from "@ionic/angular";

@Injectable({
  providedIn: 'root'
})
export class ManagePresencesGuard implements CanActivate {

  constructor(private courseService: CourseService,
              private router: Router,
              private userService: UserService,
              private toastController: ToastController) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    const choosedCourse = this.courseService.choosedCourse;

    if (!!choosedCourse) {
      return true;
    }

    this.toastController.create({position: "top", duration: 3000, message: 'Aby dostać się do wybranej ścieżki, zaloguj się do kursu'})
        .then((toast) => {
          toast.present();
        });

    this.router.navigate([`my-courses`]);
    return false;
  }
}
