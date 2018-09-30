import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { CourseService } from '../../user/services/course.service';
import { CourseRestService } from '../../course/services/course-rest.service';
import { UserPresence } from '../../../core/models/user-presence';
import { UserPresenceService } from '../../user/services/user-presence.service';
import { switchMap } from 'rxjs/operators';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-course-active-presences',
  templateUrl: './course-active-presences.component.html',
  styleUrls: ['./course-active-presences.component.scss']
})
export class CourseActivePresencesComponent implements OnInit {

  activePresences: UserPresence[] = null;

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
      .subscribe((activePresences) => {
        this.activePresences = activePresences;
      })
  }

  endPresence(presence: UserPresence) {
    this.userPresenceService.endPresence(this.courseService.choosedCourse._id, presence)
      .pipe(switchMap(() => {
        return this.courseRestService.getActivePresences(this.courseService.choosedCourse._id);
      })).subscribe((presences: UserPresence[]) => {
        this.alertService.newAlert('Obecność zatrzymana')
        this.activePresences = presences;
    })
  }


}
