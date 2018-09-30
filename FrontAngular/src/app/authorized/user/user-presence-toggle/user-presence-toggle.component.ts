import { Component, OnInit } from '@angular/core';
import { UserPresenceService } from '../services/user-presence.service';
import { UserService } from '../../../core/services/user.service';
import { CourseService } from '../services/course.service';
import { UserPresence } from '../../../core/models/user-presence';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { AlertService } from '../../../core/services/alert.service';
import { of } from 'rxjs/internal/observable/of';
import { throwError } from 'rxjs/internal/observable/throwError';

@Component({
  selector: 'app-user-presence-toggle',
  templateUrl: './user-presence-toggle.component.html',
  styleUrls: ['./user-presence-toggle.component.scss']
})
export class UserPresenceToggleComponent implements OnInit {

  activePresence$: Observable<UserPresence>;
  activePresence: UserPresence;

  constructor(private userPresence: UserPresenceService,
              private userService: UserService,
              private courseService: CourseService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.getActivePresence();
  }

  getActivePresence() {
    this.activePresence$ = this.userPresence.hasActivePresence(this.userService.loggedUser._id, this.courseService.choosedCourse._id)
      .pipe(
        tap((userPresence: UserPresence) => {
          console.log(userPresence)
          this.activePresence = userPresence;
        })
      )
  }

  startPresence() {
    return this.userPresence.startPresence(this.courseService.choosedCourse._id, this.userService.loggedUser._id)
      .pipe(
        tap(() => this.getActivePresence()),
        catchError(err => {
          this.alertService.newAlert('Nie można teraz aktywować obecnośći')
          return of(null)
        })
      ).subscribe()
  }

  endPresence() {
    return this.userPresence.endPresence(this.courseService.choosedCourse._id, this.activePresence)
      .pipe(
        tap(() => {}),
        catchError((err) => {
          console.log(err);
          this.alertService.newAlert('Nie udało się zakończyć obecności, została zakończona automatycznie lub przez instruktora', 'danger', 5000);
          return throwError(null)
        })
      ).subscribe(() => {
          this.activePresence = null;
          this.activePresence$ = of(null);
      })
  }

  refreshContent() {

  }
}
