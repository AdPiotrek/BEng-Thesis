import { Component, OnInit } from '@angular/core';
import { UserRestService } from '../services/user-rest.service';
import { UserService } from '../../../core/services/user.service';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-user-presence-list',
  templateUrl: './user-presence-list.component.html',
  styleUrls: ['./user-presence-list.component.scss']
})
export class UserPresenceListComponent implements OnInit {

  displayedColumns = ['number', 'day', 'startTime', 'endTime', 'partsCount'];
  userPresences;

  constructor(public userService: UserService,
              public courseService: CourseService,
              public userRest: UserRestService) {
  }

  getUserPresences() {
    this.userRest.getPresences(this.userService.loggedUser._id, this.courseService.choosedCourse._id)
      .subscribe((presences) => {
        console.log(presences);
        this.userPresences = presences.map((courseDay) => {
          return {
            ...courseDay,
            day: courseDay.startTime
          }
        });
      })
  }

  ngOnInit() {
    this.getUserPresences();
  }
}
