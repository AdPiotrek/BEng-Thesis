import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { CourseService } from '../../user/services/course.service';
import { CourseRestService } from '../../course/services/course-rest.service';
import { UserPresence } from '../../../core/models/user-presence';
import { UserPresenceService } from '../../user/services/user-presence.service';
import { switchMap } from 'rxjs/operators';
import { AlertService } from '../../../core/services/alert.service';
import { CourseDay } from '../../../core/models/course-day';

@Component({
  selector: 'app-course-active-presences',
  templateUrl: './course-active-presences.component.html',
  styleUrls: ['./course-active-presences.component.scss']
})
export class CourseActivePresencesComponent implements OnInit {

  activePresences: CourseDay = null;

  constructor(private userService: UserService,
              private courseService: CourseService,
              private courseRestService: CourseRestService,
              private userPresenceService: UserPresenceService,
              private alertService: AlertService) {
  }

  ngOnInit() {
    this.getActivePresences();
  }

  getActivePresences() {
    this.courseRestService.getActivePresences(this.courseService.choosedCourse._id)
      .subscribe((courseDay) => {
        this.activePresences = courseDay;
      })
  }

  endPresence(courseDay, userId) {
    this.userPresenceService.deletePresences(this.courseService.choosedCourse._id, userId, courseDay)
      .pipe(switchMap(() => {
        return this.courseRestService.getActivePresences(this.courseService.choosedCourse._id);
      })).subscribe((courseDay: CourseDay) => {
        this.alertService.newAlert('Obecność usunięta');
        this.activePresences = courseDay;
    })
  }


}
