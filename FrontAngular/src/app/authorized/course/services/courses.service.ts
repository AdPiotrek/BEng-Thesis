import { Injectable } from '@angular/core';
import { Course } from '../../../core/models/course';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {

  private chosedCourseSource = new ReplaySubject<Course>();
  public chosedCourse = this.chosedCourseSource.asObservable();


  constructor() { }

  changeCourse(course: Course) {
    this.chosedCourseSource.next(course)
  }
}
