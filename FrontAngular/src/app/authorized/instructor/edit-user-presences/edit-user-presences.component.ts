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

@Component({
  selector: 'app-edit-user-presences',
  templateUrl: './edit-user-presences.component.html',
  styleUrls: ['./edit-user-presences.component.scss']
})
export class EditUserPresencesComponent implements OnInit {

  @ViewChild('pdf') pdfContent: ElementRef;

  editedUserId: string;
  userPresenceForm: FormGroup;
  userPresences: UserPresence[] = [];

  constructor(private fb: FormBuilder,
              private alertService: AlertService,
              private activatedRoute: ActivatedRoute,
              private courseService: CourseService,
              private userPresenceService: UserPresenceService,
              private userRest: UserRestService,
              private courseRestService: CourseRestService) {
    this.createUsersPresenceForm()
    this.activatedRoute.params.subscribe((params) => {
      return this.editedUserId = params['id'];
    })
  }

  ngOnInit() {
    this.getUserPresences();
  }

  getUserPresences() {
    this.userRest.getPresences(this.editedUserId, this.courseService.choosedCourse._id)
      .subscribe(userPresences => {
        userPresences.map(userPresence => {
          return {
            ...userPresence,
            startTime: moment(userPresence.startTime),
            endTime: moment(userPresence.endTime)
          }
        });
        this.userPresences = userPresences
      })
  }

  savePresences() {
    this.userPresenceService.deletePresences(this.courseService.choosedCourse._id, this.editedUserId, this.userPresences)
      .subscribe(() => {
        this.getUserPresences();
      })
  }


  deletePresence(presenceToDelete: UserPresence) {
    this.userPresences = this.userPresences.filter((presence) => {
      return presence !== presenceToDelete
    })
  }

  createUsersPresenceForm(): void {
    this.userPresenceForm = this.fb.group({
      'day': [new Date(), Validators.required],
      'startTime': ['', [Validators.required]],
      'endTime': ['', [Validators.required]]
    }, { validator: endTimeValidator });
  }

  addPresenceDay(): void {
    const userPresence: UserPresence = this.createUserPresence();
    console.log(!this.isUserPresenceInsideCourseDays(userPresence));
    if (!this.isUserPresenceInsideCourseDays(userPresence)) {
      this.alertService.newAlert(
        'Dzień który chcesz dodać nie zawiera się w okresie kursu',
        'danger',
        3000
      );
      return;
    }
    if (this.isCourseDayAlreadyAdded(userPresence)) {
      this.alertService.newAlert(
        'Dana obecność została już dodana, sprawdź czy okresy czasowe nie nakładają się',
        'danger',
        3000
      );
      return;
    }

    this.userPresences.push(userPresence);
  }

  getTimeFromInput(time: string): { hours: string, minutes: string } {
    return {
      hours: time.slice(0, 2),
      minutes: time.slice(3, 5)
    };
  }

  isCourseDayAlreadyAdded(courseDay: UserPresence): boolean {
    return this.userPresences.some(day => {
      return day.startTime <= courseDay.endTime && day.endTime >= courseDay.startTime
    });
  }

  createUserPresence(): UserPresence {
    const day = this.userPresenceForm.value.day;
    const dayStartTime = this.getTimeFromInput(this.userPresenceForm.value.startTime);
    const dayEndTime = this.getTimeFromInput(this.userPresenceForm.value.endTime);

    return {
      user: this.editedUserId,
      startTime: new Date(day).setHours(+dayStartTime.hours, +dayStartTime.minutes),
      endTime: new Date(day).setHours(+dayEndTime.hours, +dayEndTime.minutes),
      isActive: false
    }
  }

  isUserPresenceInsideCourseDays(userPresence: UserPresence): boolean {
    const choosedCourse = this.courseService.choosedCourse
    console.log(choosedCourse)
    let courseStartDate = choosedCourse.startDate;
    let courseEndDate = choosedCourse.endDate;

    if (typeof courseStartDate === 'object' || typeof courseStartDate === 'string') {
      courseStartDate = Date.parse(courseStartDate)
    }
    if (typeof courseEndDate === 'object' || typeof courseEndDate === 'string') {
      courseEndDate = Date.parse(courseEndDate)
    }

    return userPresence.startTime >= courseStartDate && userPresence.endTime <= courseEndDate + 24 * 3600 * 1000 - 1;

  }






}
