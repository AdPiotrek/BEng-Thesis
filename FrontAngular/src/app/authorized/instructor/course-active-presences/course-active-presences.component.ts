import {Component, OnInit} from '@angular/core';
import {UserService} from '../../../core/services/user.service';
import {CourseService} from '../../user/services/course.service';
import {CourseRestService} from '../../course/services/course-rest.service';
import {UserPresenceService} from '../../user/services/user-presence.service';
import {switchMap} from 'rxjs/operators';
import {AlertService} from '../../../core/services/alert.service';
import {CourseDay} from '../../../core/models/course-day';

@Component({
  selector: 'app-course-active-presences',
  templateUrl: './course-active-presences.component.html',
  styleUrls: ['./course-active-presences.component.scss']
})
export class CourseActivePresencesComponent implements OnInit {

  activePresences: CourseDay = null;
  error = false;
  displayedColumns = ['index', 'email', 'firstName', 'lastName', 'delete']
  interval

  constructor(private userService: UserService,
              private courseService: CourseService,
              private courseRestService: CourseRestService,
              private userPresenceService: UserPresenceService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.getActivePresences();

    this.interval = setInterval(this.getActivePresences.bind(this), 5000)
  }

  getActivePresences() {
    this.courseRestService.getActivePresences(this.courseService.choosedCourse._id)
      .subscribe((courseDay: any) => {
        if (courseDay && courseDay.presentUsers.length) {
          this.activePresences = courseDay;
          this.error = false;
        } else {
          this.activePresences = courseDay;
          this.error = true;
        }
      })
  }

  endPresence(courseDay, userId) {
    this.userPresenceService.deletePresences(userId, this.courseService.choosedCourse._id, courseDay)
      .pipe(switchMap(() => {
        return this.courseRestService.getActivePresences(this.courseService.choosedCourse._id);
      })).subscribe((courseDay: any) => {
      this.alertService.newAlert('Obecność usunięta');
      if (courseDay && courseDay.presentUsers.length) {
        this.activePresences = courseDay;
        this.error = false;
      } else {
        this.activePresences = courseDay;
        this.error = true;
      }
    })
  }

  ngOnDestroy() {
    clearInterval(this.interval)
  }


}
