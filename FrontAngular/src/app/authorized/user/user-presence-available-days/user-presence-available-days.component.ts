import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Course } from '../../../core/models/course';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-user-presence-available-days',
  templateUrl: './user-presence-available-days.component.html',
  styleUrls: ['./user-presence-available-days.component.scss']
})
export class UserPresenceAvailableDaysComponent implements OnInit {

  choosedCourse: Observable<Course>;

  constructor(private courseService: CourseService) { }

  ngOnInit() {
    this.choosedCourse = this.courseService.choosedCourse$;
  }



  refreshContent() {
  }

}
