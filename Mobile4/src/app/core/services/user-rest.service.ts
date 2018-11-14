import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs/internal/Observable";
import {Course} from "../models/course";
import {environment} from "../../../environments/environment";
import {CourseDay} from "../models/course-day";
import {Pagination} from "../models/pagination";

@Injectable({
  providedIn: 'root'
})
export class UserRestService {

  constructor(private http: HttpClient) {
  }

  getUserCourses(id: string): Observable<Pagination<Course>> {
    return this.http.get<Pagination<Course>>(`${environment.restApiUrl}/users/${id}/courses`);
  }

  getPresences(userId: string, courseId: string): Observable<CourseDay[]> {
    return this.http.get<CourseDay[]>(`${environment.restApiUrl}/users/${userId}/presences/${courseId}`);
  }

}
