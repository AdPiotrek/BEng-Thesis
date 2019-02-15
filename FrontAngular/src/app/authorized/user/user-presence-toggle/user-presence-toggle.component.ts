import { Component, OnInit } from '@angular/core';
import { UserPresenceService } from '../services/user-presence.service';
import { UserService } from '../../../core/services/user.service';
import { CourseService } from '../services/course.service';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map, tap } from 'rxjs/operators';
import { AlertService } from '../../../core/services/alert.service';
import { of } from 'rxjs/internal/observable/of';
import { CourseDay } from '../../../core/models/course-day';

@Component({
  selector: 'app-user-presence-toggle',
  templateUrl: './user-presence-toggle.component.html',
  styleUrls: ['./user-presence-toggle.component.scss']
})
export class UserPresenceToggleComponent implements OnInit {

  activePresence: CourseDay;

  constructor(private userPresence: UserPresenceService,
              private userService: UserService,
              private courseService: CourseService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.getActivePresence();
  }

  getActivePresence() {
    this.userPresence.hasActivePresence(this.userService.loggedUser._id, this.courseService.choosedCourse._id)
      .subscribe((activePresence) => {
        console.log(activePresence)
        this.activePresence = activePresence;
      })
  }

  startPresence() {
    return this.userPresence.startPresence(this.courseService.choosedCourse._id, this.userService.loggedUser._id)
      .pipe(
        tap(() => this.getActivePresence()),
        catchError(err => {
          this.alertService.newAlert('Nie można teraz aktywować obecnośći', 'danger')
          return of(null)
        })
      ).subscribe()
  }

}
