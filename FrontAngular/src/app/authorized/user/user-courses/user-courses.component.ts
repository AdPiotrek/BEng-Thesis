import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { merge, of as observableOf } from 'rxjs/index';
import { Course } from '../../../core/models/course';
import { Pagination } from '../../../core/models/pagination';
import { UserRestService } from '../services/user-rest.service';
import { ActivatedRoute, Params } from '@angular/router';
import { CourseService } from '../services/course.service';

@Component({
  selector: 'app-user-courses',
  templateUrl: './user-courses.component.html',
  styleUrls: ['./user-courses.component.scss']
})
export class UserCoursesComponent implements OnInit {

  displayedColumns: string[] = ['number', 'name', 'startDate', 'endDate', 'code'];
  data: Course[] = [];
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private userRest: UserRestService,
              private route: ActivatedRoute,
              private courseService: CourseService) {
  }

  ngOnInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.paginator.page
      .pipe(
        startWith({}),
        switchMap(() => this.route.params),
        switchMap((params: Params) => {
          this.isLoadingResults = true;
          return this.userRest.getUserCourses(params['id']);
        }),
        map((data: Pagination<Course>) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.totalPageCount;
          return data.items;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return observableOf([]);
        })
      ).subscribe((data: Course[]) => this.data = data);
  }

  chooseCourse(course: Course) {
    this.courseService.changeChoosedCourse(course);
  }

}
