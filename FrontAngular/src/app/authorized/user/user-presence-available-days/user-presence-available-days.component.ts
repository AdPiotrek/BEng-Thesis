import { Component, OnInit } from '@angular/core';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-user-presence-available-days',
  templateUrl: './user-presence-available-days.component.html',
  styleUrls: ['./user-presence-available-days.component.scss']
})
export class UserPresenceAvailableDaysComponent implements OnInit {

  displayedColumns = ['number', 'day', 'startTime', 'endTime', 'partsCount'];

  availableDays;

  constructor(private courseService: CourseService) { }

  ngOnInit() {
    this.availableDays = this.courseService.choosedCourse.courseDays.map(courseDay => {
      return {
        ...courseDay,
        day: courseDay.startTime
      }
    });
  }



  refreshContent() {
  }

}
