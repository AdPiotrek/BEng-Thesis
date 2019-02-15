import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { merge, of as observableOf } from 'rxjs/index';
import { Course } from '../../../core/models/course';
import { Pagination } from '../../../core/models/pagination';
import { UserRestService } from '../services/user-rest.service';
import { ActivatedRoute, Params } from '@angular/router';
import { CourseService } from '../services/course.service';
import { AlertService } from '../../../core/services/alert.service';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-user-courses',
  templateUrl: './user-courses.component.html',
  styleUrls: ['./user-courses.component.scss']
})
export class UserCoursesComponent implements OnInit {

  displayedColumns: string[] = ['number', 'name', 'startDate', 'endDate', 'code', 'status'];
  data: Course[] = null;
  resultsLength = 0;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userRest: UserRestService,
              private route: ActivatedRoute,
              private courseService: CourseService,
              private alertService: AlertService,
             ) {

  }

  ngOnInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.paginator.page, this.sort.sortChange)
      .pipe(
        startWith({}),
        switchMap(() => this.route.params),
        switchMap((params: Params) => {
          return this.userRest.getUserCourses(params['id'], this.paginator.pageIndex, this.sort.active, this.sort.direction || this.sort.start);
        }),
        map((data: Pagination<Course>) => {
          this.isRateLimitReached = false;
          this.resultsLength = data.totalPageCount;
          return data.items;
        }),
        catchError(() => {
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe((data: Course[]) => this.data = data);
  }

  chooseCourse(course: Course) {
    this.courseService.changeChoosedCourse(course);
    this.alertService.newAlert('Zmieniono wybrany kurs')
  }

}
