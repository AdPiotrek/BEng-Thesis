import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { Course } from '../../../core/models/course';
import { UserPresence } from '../../../core/models/user-presence';

@Injectable({
  providedIn: 'root'
})
export class UserRestService {

  constructor(private http: HttpClient) {
  }

  getUserCourses(id: string): Observable<Course[]> {
    return this.http.get<Course[]>(`${environment.restApiUrl}/users/${id}/courses`);
  }

  getPresences(userId: string, courseId: string): Observable<UserPresence[]> {
    return this.http.get<UserPresence[]>(`${environment.restApiUrl}/users/${userId}/presences/${courseId}`);
  }

}
