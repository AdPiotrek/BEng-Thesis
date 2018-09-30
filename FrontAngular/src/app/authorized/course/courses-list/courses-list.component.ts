import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort} from '@angular/material';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {CourseRestService} from '../services/course-rest.service';
import {SignToCourseDialogComponent} from '../sign-to-course-dialog/sign-to-course-dialog.component';
import {Course} from '../../../core/models/course';
import { Pagination } from '../../../core/models/pagination';

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss']
})
export class CoursesListComponent implements OnInit {
  displayedColumns: string[] = ['number', 'name', 'startDate', 'endDate', 'code' ];
  data: Course[];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private courseRest: CourseRestService,
              public dialog: MatDialog) {
  }

  openDialog(course: Course): void {
    const dialogRef = this.dialog.open(SignToCourseDialogComponent, {
      width: '500px',
      data: course
    });
  }

  ngOnInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.courseRest.getCourses();
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
      ).subscribe((data) => {
        this.data = data
    });
  }
}

