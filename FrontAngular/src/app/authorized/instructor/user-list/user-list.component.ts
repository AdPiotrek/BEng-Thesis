import { Component, OnInit, ViewChild } from '@angular/core';
import { merge, of } from 'rxjs/index';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { Pagination } from '../../../core/models/pagination';
import { MatDialog, MatDialogRef, MatPaginator, MatSort } from '@angular/material';
import { InstructorRestService } from '../services/instructor-rest.service';
import { User } from '../../../core/models/user';
import { CourseService } from '../../user/services/course.service';
import { DeleteUserDialogComponent } from './delete-user-dialog/delete-user-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  displayedColumns: string[] = ['index', 'email', 'firstName', 'lastName', 'delete', 'edit'];
  data: User[];
  openedDialog: MatDialogRef<DeleteUserDialogComponent>;

  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private instructorRest: InstructorRestService,
              private courseService: CourseService,
              private dialog: MatDialog,
              private router: Router) {
  }

  openDialog(userId: string): void {
    this.openedDialog = this.dialog.open(DeleteUserDialogComponent, {
      width: '500px'
    });

    this.openedDialog.afterClosed().subscribe((val) => {
      console.log(this.openedDialog.componentInstance.shouldBeDeleted);
      if (this.openedDialog.componentInstance.shouldBeDeleted) {
        this.deleteUser(userId)
      }
    });

  }

  deleteUser(userId: string) {
   this.instructorRest.deleteUserFromCourse(this.courseService.choosedCourse._id, userId)
     .subscribe( () => {
         this.getTableData();
     })
  }

  editUserPresence(userId: string) {
    this.router.navigate([`i/edit-user-presences/${userId}`])
  }
  ngOnInit() {
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);
    this.getTableData()
  }

  getTableData() {
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.instructorRest.getCourseUsers(
            this.courseService.choosedCourse._id,
            this.paginator.pageIndex,
            this.sort.active,
            this.sort.direction || this.sort.start
          );
        }),
        map((data: Pagination<User>) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = false;
          this.resultsLength = data.totalPageCount;
          return data.items;
        }),
        catchError((e) => {
          this.isLoadingResults = false;
          this.isRateLimitReached = true;
          return of(null)
        })
      ).subscribe((data) => {
      this.data = data
    });
  }
}

