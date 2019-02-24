import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CourseRestService} from '../services/course-rest.service';
import {Course} from '../../../core/models/course';
import {CourseDay} from '../../../core/models/course-day';
import {AlertService} from '../../../core/services/alert.service';
import {endTimeValidator} from '../../../shared/validators/end-time-validator';
import {combineLatest, map, tap} from 'rxjs/operators';
import * as moment from 'moment'
import {Moment} from 'moment';
import {merge} from 'rxjs';
import {of} from 'rxjs/internal/observable/of';
import {Router} from "@angular/router";
import {UserService} from "../../../core/services/user.service";

@Component({
  selector: 'app-add-course',
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.component.scss']
})
export class AddCourseComponent implements OnInit {
  courseCreatingForm: FormGroup;
  courseDayForm: FormGroup;
  courseDays: Array<CourseDay> = [];

  startDateFilter = (day: Date): boolean => {
    return day >= this.courseCreatingForm.value['startDate']
  };

  endDateFilter = (day: any): boolean => {
    return day <= this.courseCreatingForm.value['endDate'];
  }

  constructor(public fb: FormBuilder,
              public courseRest: CourseRestService,
              public alertService: AlertService,
              public router: Router,
              public userService: UserService) {
    this.createCourseCreatingForm();
    this.createCourseDayForm();
  }

  ngOnInit() {
    const timeValueChange = merge(
      this.courseCreatingForm.valueChanges,
      of({...this.courseCreatingForm.value})
    );

    this.courseCreatingForm.valueChanges.pipe(
      tap((value) => {
        this.courseDays.forEach((courseDay) => {

          let {lessonTime, breakTime} = value;
          const {partsCount} = courseDay;

          lessonTime = this.getTimeFromInput(lessonTime);
          breakTime = this.getTimeFromInput(breakTime);

          lessonTime = +lessonTime.hours * 60 + +lessonTime.minutes;
          breakTime = +breakTime.hours * 60 + +breakTime.minutes;

          let momentObject = moment(courseDay.startTime);

          momentObject.add(partsCount * (lessonTime + breakTime), 'minutes');

          courseDay.endTime = momentObject.toDate();
        })
      })
    ).subscribe()

    merge(this.courseDayForm.get('startTime').valueChanges).pipe(
      combineLatest(timeValueChange),
      map(([value, formValue]) => {
        const time = this.getTimeFromInput(value);
        const momentObject: Moment = moment().hour(+time.hours).minutes(+time.minutes);
        let {lessonTime, breakTime} = formValue;
        const partsCount = this.courseDayForm.value.partsCount;
        lessonTime = this.getTimeFromInput(lessonTime);
        breakTime = this.getTimeFromInput(breakTime);

        lessonTime = +lessonTime.hours * 60 + +lessonTime.minutes;
        breakTime = +breakTime.hours * 60 + +breakTime.minutes;

        momentObject.add(partsCount * (lessonTime + breakTime), 'minutes');

        const minutes = momentObject.get('minutes') < 10 ? `0${momentObject.get('minutes')}` : momentObject.get('minutes');
        const hours = momentObject.get('hours') < 10 ? `0${momentObject.get('hours')}`: momentObject.get('hours');

        console.log(hours, minutes)
        this.courseDayForm.patchValue({'endTime': `${hours}:${minutes}`})
      }),
    ).subscribe()

    merge(this.courseDayForm.get('partsCount').valueChanges).pipe(
      combineLatest(timeValueChange),
      map(([_, formValue]) => {

        const value = this.courseDayForm.get('startTime').value;
        if (value.trim() === '') {
          return;
        }
        const time = this.getTimeFromInput(value);
        const momentObject: Moment = moment().hour(+time.hours).minutes(+time.minutes);
        let {lessonTime, breakTime} = formValue;
        const partsCount = this.courseDayForm.value.partsCount;
        lessonTime = this.getTimeFromInput(lessonTime);
        breakTime = this.getTimeFromInput(breakTime);

        lessonTime = +lessonTime.hours * 60 + +lessonTime.minutes;
        breakTime = +breakTime.hours * 60 + +breakTime.minutes;

        momentObject.add(partsCount * (lessonTime + breakTime), 'minutes');

        const minutes = momentObject.get('minutes') < 10 ? `0${momentObject.get('minutes')}` : momentObject.get('minutes');
        const hours = momentObject.get('hours') < 10 ? `0${momentObject.get('hours')}`: momentObject.get('hours');

        console.log(hours, minutes)
        this.courseDayForm.patchValue({'endTime': `${hours}:${minutes}`})
      }),
    ).subscribe()
  }



  createCourseCreatingForm(): void {
    this.courseCreatingForm = this.fb.group({
      'name': ['', Validators.required],
      'key': ['', [Validators.required, Validators.minLength(4)]],
      'startDate': [new Date().setHours(0, 0, 0), Validators.required],
      'endDate': [new Date().setHours(0, 0, 0), Validators.required],
      'partsCount': [1, [Validators.required, Validators.min(1)]],
      'status': 'inProgress',
      'lessonTime': ['00:45', [Validators.required]],
      'breakTime': ['00:15', [Validators.required,]]
    });
  }

  createCourseDayForm(): void {
    this.courseDayForm = this.fb.group({
      'day': [new Date(), Validators.required],
      'startTime': ['', [Validators.required]],
      'endTime': ['', [Validators.required]],
      'partsCount': [1, [Validators.required, Validators.min(1)]],
    }, {validator: endTimeValidator});
  }

  addCourseDay(): void {
    const courseDay: CourseDay = this.createCourseDay();
    if (!this.isCourseDayInsideCourseDays(courseDay)) {
      this.alertService.newAlert(
        'Dzień który chcesz dodać nie zawiera się w okresie kursu',
        'danger',
        3000
      );
      return;
    }
    if (this.isCourseDayAlreadyAdded(courseDay)) {
      this.alertService.newAlert(
        'Dany dzień został już dodany, sprawdź czy okresy czasowe nie nakładają się',
        'danger',
        3000
      );
      return;
    }

    this.courseDays.push(courseDay);
  }

  addCourse() {
    const course: Course = {
      ...this.courseCreatingForm.value,
      courseDays: [...this.courseDays]
    };

    if (course.startDate > course.endDate) {
      this.alertService.newAlert('Daty rozpoczęcia lub zakończenia kursu są nieprawidłowe', 'danger');
    }

    if (this.validateDays(course)) {
      this.alertService.newAlert('Planowane dni odbywania się kursu nie znajdują się pomiedzy datą startu i zakończenia', 'danger');
    }

    this.courseRest.addCourse(course)
      .subscribe(
        (x) => {
          this.alertService.newAlert('Kurs został dodany pomyślnie');
          this.router.navigateByUrl(`u/${this.userService.loggedUser._id}/courses`)
        },
        (err) => {
          this.alertService.newAlert(err.error.message, 'danger')
        }
      );
  }

  getTimeFromInput(time: string): { hours: string, minutes: string } {
    return {
      hours: time.slice(0, 2),
      minutes: time.slice(3, 5)
    };
  }

  isCourseDayAlreadyAdded(courseDay: CourseDay): boolean {
    return this.courseDays.some(day => {
      return day.startTime <= courseDay.endTime && day.endTime >= courseDay.startTime
    });
  }

  createCourseDay(): CourseDay {
    const day = this.courseDayForm.value.day;
    const dayStartTime = this.getTimeFromInput(this.courseDayForm.value.startTime);
    const dayEndTime = this.getTimeFromInput(this.courseDayForm.value.endTime);
    const partsCount = this.courseDayForm.value.partsCount;

    return {
      partsCount,
      startTime: new Date(day).setHours(+dayStartTime.hours, +dayStartTime.minutes),
      endTime: new Date(day).setHours(+dayEndTime.hours, +dayEndTime.minutes)
    }
  }

  isCourseDayInsideCourseDays(courseDay: CourseDay): boolean {
    let courseStartDate = this.courseCreatingForm.get('startDate').value;
    let courseEndDate = this.courseCreatingForm.get('endDate').value;

    if (typeof courseStartDate === 'object') {
      courseStartDate = Date.parse(courseStartDate)
    }
    if (typeof courseEndDate === 'object') {
      courseEndDate = Date.parse(courseEndDate)
    }

    return courseDay.startTime >= courseStartDate && courseDay.endTime <= courseEndDate + 24 * 3600 * 1000 - 1;
  }

  deletePresence(courseDay) {
    this.courseDays = this.courseDays.filter((day) => day !== courseDay)
  }

  validateDays(coourse: Course) {

    return coourse.courseDays.find(day => this.isDateInCourse(coourse, day.startTime) && this.isDateInCourse(coourse, day.endTime))
  }

  isDateInCourse(course: Course, date: Date | number) {
    if (typeof date === 'number') {
      return course.startDate <= date && course.endDate >= date
    }

    return course.startDate <= date.getTime() && course.endDate >= date.getTime();
  }

}
