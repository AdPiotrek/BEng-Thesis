import {Component, Inject, Input, OnInit} from '@angular/core';
import {Course} from '../../../core/models/course';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CourseRestService} from '../services/course-rest.service';
import {UserService} from '../../../core/services/user.service';
import {catchError, map, tap} from 'rxjs/operators';
import {Observable} from 'rxjs/internal/Observable';
import {AddUserToCourseRequest} from '../../../core/models/add-user-to-course-request';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import { of } from 'rxjs/internal/observable/of';


@Component({
  selector: 'app-sign-to-course-dialog',
  templateUrl: './sign-to-course-dialog.component.html',
  styleUrls: ['./sign-to-course-dialog.component.scss']
})
export class SignToCourseDialogComponent implements OnInit {
  responseMessage: string;
  signToCourse$: Observable<string>;
  responseClass = false;
  signInToCourseForm: FormGroup;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private courseRest: CourseRestService,
              public dialogRef: MatDialogRef<SignToCourseDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public course: Course) {
    this.createSignInToCourseForm();
  }

  ngOnInit() {
  }

  createSignInToCourseForm(){
    this.signInToCourseForm = this.fb.group({
      'key': ['', Validators.minLength(4)]
    })
  }

  signInToCourse() {
    const req: AddUserToCourseRequest = {
      userId: this.userService.loggedUser._id,
      key: this.signInToCourseForm.value.key
    };
    this.signToCourse$ = this.courseRest.addUserToCourse(this.course._id, req)
      .pipe(
        map(() => {return ('Zostałeś dopisany do kursu')}),
        catchError(err => {
          console.log(err)
          return of(err.error.message)
        })
      )
  }


  generateResponseMessage(status: string) {

  }

}
