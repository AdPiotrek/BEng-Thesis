  import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { UserPresence } from '../../../core/models/user-presence';
import { CourseDay } from '../../../core/models/course-day';

@Injectable({
  providedIn: 'root'
})
export class UserPresenceService {

  constructor(private http: HttpClient) {

  }

  getServerTime(): Observable<Date> {
    return this.http.get<Date>(`${environment.restApiUrl}/serverTime`);
  }

  startPresence(courseId: string, userId: string) {
    return this.http.post(`${environment.restApiUrl}/courses/${courseId}/startPressence`, {userId});
  }

  hasActivePresence(userId: string, courseId: string) {
    return this.http.get<CourseDay>(`${environment.restApiUrl}/users/${userId}/activePresence/${courseId}`);
  }

  markPresenceActive(userId: string, courseId: string, courseDay: CourseDay) {
    return this.http.put(`${environment.restApiUrl}/instructor/course/${courseId}/start-presence/${userId}`, {courseDay})
  }

  deletePresences(userId: string, courseId: string, courseDay: CourseDay) {
    return this.http.put(`${environment.restApiUrl}/instructor/course/${courseId}/delete-presence/${userId}`,{courseDay})
  }

}
