import { Injectable } from '@angular/core';
import { Course } from '../../../core/models/course';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import { Subject } from 'rxjs/internal/Subject';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  choosedCourseSource = new ReplaySubject<Course>();
  choosedCourse$ = this.choosedCourseSource.asObservable();
  choosedCourse: Course;

  constructor() {}

  changeChoosedCourse(course: Course) {
    this.choosedCourse = course;
    this.choosedCourseSource.next(course)
  }

}
