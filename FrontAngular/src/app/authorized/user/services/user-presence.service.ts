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

  deletePresences(courseId: string, userId: string, courseDay) {
    return this.http.put(`${environment.restApiUrl}/instructor/course/${courseId}/presences/${userId}`,{courseDay})
  }

}
