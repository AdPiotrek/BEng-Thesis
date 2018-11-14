import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs/internal/ReplaySubject';
import {Course} from "../models/course";

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
