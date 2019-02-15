import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Course } from '../../../core/models/course';
import { CourseDay } from '../../../core/models/course-day';

@Injectable({
  providedIn: 'root'
})
export class UserRestService {

  constructor(private http: HttpClient) {
  }

  getUserById(id: string) {
    return this.http.get(`${environment.restApiUrl}/users/${id}`)
  }


  getUserCourses(id: string, page = 0, sort = 'name', direction =  'asc'): Observable<Course[]> {
    return this.http.get<Course[]>(`${environment.restApiUrl}/users/${id}/courses?page=${page}&sort=${sort}&direction=${direction}`);
  }

  getPresences(userId: string, courseId: string): Observable<CourseDay[]> {
    return this.http.get<CourseDay[]>(`${environment.restApiUrl}/users/${userId}/presences/${courseId}`);
  }

}
