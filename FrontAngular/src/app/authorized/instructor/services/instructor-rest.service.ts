import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Course } from '../../../core/models/course';
import { Observable } from 'rxjs/internal/Observable';
import { User } from '../../../core/models/user';
import { Pagination } from '../../../core/models/pagination';

@Injectable({
  providedIn: 'root'
})
export class InstructorRestService {

  constructor(private http: HttpClient) {
  }

  public addUserToCourse(courseId: string, email: string): Observable<Course> {
    return this.http.put<Course>(`${environment.restApiUrl}/instructor/course/${courseId}/add/user`, { email: email })
  }

  public getCourseUsers(courseId: string, page = 0, sort = 'name', direction = 'asc'): Observable<Pagination<User>> {
    return this.http.get<Pagination<User>>(`${environment.restApiUrl}/instructor/course/${courseId}/users?page=${page}&sort=${sort}&direction=${direction}`)
  }

  public deleteUserFromCourse(courseId: string, userId: string) {
    return this.http.put(`${environment.restApiUrl}/instructor/course/${courseId}/delete/user/${userId}`, {});
  }
}
