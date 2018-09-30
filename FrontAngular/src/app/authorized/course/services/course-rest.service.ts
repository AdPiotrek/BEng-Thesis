import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Course } from '../../../core/models/course';
import {Observable} from 'rxjs/internal/Observable';
import {Pagination} from '../../../core/models/pagination';
import {AddUserToCourseRequest} from '../../../core/models/add-user-to-course-request';
import { UserPresence } from '../../../core/models/user-presence';

@Injectable({
  providedIn: 'root'
})
export class CourseRestService {

  constructor(private http: HttpClient) { }

  addCourse(course: Course) {
    return this.http.post(`${environment.restApiUrl}/courses`, course);
  }

  getCourses(): Observable<Pagination<Course>> {
    return this.http.get<Pagination<Course>>(`${environment.restApiUrl}/courses`)
  }

  addUserToCourse(courseId: string, data: AddUserToCourseRequest): Observable<Course> {
    return this.http.put<Course>(`${environment.restApiUrl}/courses/${courseId}/users`, data)
  }

  getActivePresences(courseId: string): Observable<UserPresence[]> {
    return this.http.get<UserPresence[]>(`${environment.restApiUrl}/courses/${courseId}/active-presences`)
  }

  getPresences(courseId: string) {
    return this.http.get<UserPresence[]>(`${environment.restApiUrl}/courses/${courseId}/presences`)
  }
}
