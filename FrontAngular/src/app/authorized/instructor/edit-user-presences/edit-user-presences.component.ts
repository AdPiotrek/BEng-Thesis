import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertService } from '../../../core/services/alert.service';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../user/services/course.service';
import { UserPresenceService } from '../../user/services/user-presence.service';
import { UserRestService } from '../../user/services/user-rest.service';
import { CourseRestService } from '../../course/services/course-rest.service';
import { CourseDay } from '../../../core/models/course-day';
import { switchMap, tap } from 'rxjs/operators';
import {Observable} from "rxjs";

@Component({
  selector: 'app-edit-user-presences',
  templateUrl: './edit-user-presences.component.html',
  styleUrls: ['./edit-user-presences.component.scss']
})
export class EditUserPresencesComponent implements OnInit {

  @ViewChild('pdf') pdfContent: ElementRef;
  displayedColumns: string[] = ['number', 'date','startDate', 'endDate', 'markPresence', 'deletePresence'];
  data: CourseDay[];
  user$: Observable<any>;

  isLoadingResults = true;
  editedUserId: string;

  constructor(private alertService: AlertService,
              private activatedRoute: ActivatedRoute,
              private courseService: CourseService,
              private courseRestService: CourseRestService,
              private userPresenceService: UserPresenceService,
              private userService: UserRestService) {
    this.activatedRoute.params.subscribe((params) => {
      this.user$ = this.userService.getUserById(params.id);
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
