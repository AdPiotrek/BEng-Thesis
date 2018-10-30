import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { endTimeValidator } from '../../../shared/validators/end-time-validator';
import { AlertService } from '../../../core/services/alert.service';
import { UserPresence } from '../../../core/models/user-presence';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../user/services/course.service';
import { UserPresenceService } from '../../user/services/user-presence.service';
import { UserRestService } from '../../user/services/user-rest.service';
import * as moment from 'moment';
import { CourseRestService } from '../../course/services/course-rest.service';
import { CourseDay } from '../../../core/models/course-day';
import { switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-edit-user-presences',
  templateUrl: './edit-user-presences.component.html',
  styleUrls: ['./edit-user-presences.component.scss']
})
export class EditUserPresencesComponent implements OnInit {

  @ViewChild('pdf') pdfContent: ElementRef;
  displayedColumns: string[] = ['number', 'date','startDate', 'endDate', 'markPresence', 'deletePresence'];
  data: CourseDay[];

  isLoadingResults = true;
  editedUserId: string;

  constructor(private alertService: AlertService,
              private activatedRoute: ActivatedRoute,
              private courseService: CourseService,
              private courseRestService: CourseRestService,
              private userPresenceService: UserPresenceService) {
    this.activatedRoute.params.subscribe((params) => {
      return this.editedUserId = params['id'];
    })
  }

  ngOnInit() {
    this.getUserPresences();
  }

  getUserPresences() {
    this.isLoadingResults = true;
    this.courseRestService.getCourseDays(this.courseService.choosedCourse._id)
      .subscribe((data) => {
        this.isLoadingResults = false;
        this.data = data;
      })
  }

  checkUserPresence(courseDay: CourseDay) {
    this.userPresenceService.markPresenceActive(this.editedUserId, this.courseService.choosedCourse._id, courseDay)
      .pipe(
        tap(() => this.getUserPresences())
      ).subscribe()
  }

  unCheckUserPresence(courseDay: CourseDay) {
    this.userPresenceService.deletePresences(this.editedUserId, this.courseService.choosedCourse._id, courseDay)
      .pipe(
        tap(() => this.getUserPresences())
      ).subscribe()
  }

  wasUserPresented(courseDay: CourseDay) {
    console.log(courseDay.presentUsers)
    return courseDay.presentUsers.some((userId) => userId.toString() === this.editedUserId)
  }
}
