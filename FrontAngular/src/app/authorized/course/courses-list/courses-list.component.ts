import {Component, OnInit, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSort} from '@angular/material';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {CourseRestService} from '../services/course-rest.service';
import {SignToCourseDialogComponent} from '../sign-to-course-dialog/sign-to-course-dialog.component';
import {Course} from '../../../core/models/course';
import {Pagination} from '../../../core/models/pagination';
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-courses-list',
  templateUrl: './courses-list.component.html',
  styleUrls: ['./courses-list.component.scss']
})
export class CoursesListComponent implements OnInit {
  displayedColumns: string[] = ['number', 'name', 'startDate', 'endDate', 'code', 'status'];
  data: Course[];

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  searchInput: FormGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(private courseRest: CourseRestService,
              public dialog: MatDialog,
              private fb: FormBuilder) {
    this.searchInput = this.fb.group({
      input: ''
    })
  }

  openDialog(course: Course): void {
    const dialogRef = this.dialog.open(SignToCourseDialogComponent, {
      width: '500px',
      data: course
    });
  }

  ngOnInit() {
    this.sort.sortChange.subscribe((x) => {
      this.paginator.pageIndex = 0
    });
    merge(this.sort.sortChange, this.paginator.page, this.searchInput.get('input').valueChanges)
      .pipe(
        startWith({
          active: 'name',
          direction: 'desc',
          pageIndex: 1,
          search: '',
        }),
        switchMap((prop) => {
          this.isLoadingResults = true;
          return this.courseRest.getCourses(this.searchInput.get('input').value, this.paginator.pageIndex, this.sort.active, this.sort.direction || this.sort.start);
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

      if (!data.length) {
        this.isRateLimitReached = true;
      }
    });
  }
}

