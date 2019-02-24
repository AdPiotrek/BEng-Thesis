import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseRestService } from '../services/course-rest.service';
import { AlertService } from '../../../core/services/alert.service';
import { endTimeValidator } from '../../../shared/validators/end-time-validator';
import { CourseService } from '../../user/services/course.service';
import { CourseDay } from '../../../core/models/course-day';
import { of } from 'rxjs/internal/observable/of';
import { merge } from 'rxjs/index';
import { Moment } from 'moment';
import { combineLatest, map, tap } from 'rxjs/operators';
import * as moment from 'moment'

@Component({
  selector: 'app-course-edit',
  templateUrl: './course-edit.component.html',
  styleUrls: ['./course-edit.component.scss']
})
export class CourseEditComponent implements OnInit {

  courseCreatingForm: FormGroup;
  courseDayForm: FormGroup;
  courseDays: CourseDay[];
  courseDayFilter = (day: Date): boolean => {
    let minDate: number | Date = 0, maxDate: number | Date = 0;
    this.courseService.choosedCourse.courseDays.forEach((courseDate) => {
      minDate = minDate < courseDate.startTime ? courseDate.startTime : minDate;
      maxDate = maxDate > courseDate.endTime ? courseDate.endTime : maxDate;
    });


    return day.valueOf() > minDate && day.valueOf() < maxDate;

  };

  startDateFilter = (day: Date): boolean => {

    let minDate: any = 0;
    this.courseService.choosedCourse.courseDays.forEach((courseDate) => {
      minDate = minDate < Date.parse(<any>courseDate.startTime) ? Date.parse(<any>courseDate.startTime) : minDate;
    });

    return day.valueOf() <= Date.parse(this.courseCreatingForm.value['endDate']) && day.valueOf() <= minDate
  };

  endDateFilter = (day: Date): boolean => {

    let maxDate: any = Number.MAX_SAFE_INTEGER;
    this.courseService.choosedCourse.courseDays.forEach((courseDate) => {
      maxDate = maxDate > Date.parse(<any>courseDate.endTime) ? Date.parse(<any>courseDate.endTime) : maxDate;
    });
    return day.valueOf() >= Date.parse(this.courseCreatingForm.value['startDate']) && day.valueOf() >= maxDate;
  };

  constructor(public fb: FormBuilder,
              public courseRest: CourseRestService,
              public courseService: CourseService,
              public alertService: AlertService) {
    this.createCourseDayForm();
    this.createCourseCreatingForm();
  }



  ngOnInit() {
    this.courseCreatingForm.patchValue(this.courseService.choosedCourse);
    this.courseDays = this.courseService.choosedCourse.courseDays;

    const timeValueChange = merge(
      this.courseCreatingForm.valueChanges,
      of({ ...this.courseCreatingForm.value })
    );

    this.courseCreatingForm.valueChanges.pipe(
      tap(() => {
        this.courseDays.forEach((courseDay) => {

          const { partsCount } = courseDay;

          let lessonTime: any = this.courseService.choosedCourse.lessonTime;
          let breakTime: any = this.courseService.choosedCourse.breakTime;

          lessonTime = this.getTimeFromInput(lessonTime);
          breakTime = this.getTimeFromInput(breakTime);

          lessonTime = +lessonTime.hours * 60 + +lessonTime.minutes;
          breakTime = +breakTime.hours * 60 + +breakTime.minutes;

          let momentObject = moment(courseDay.startTime);

          momentObject.add(<any>partsCount * (lessonTime + breakTime), 'minutes');

          courseDay.endTime = momentObject.toDate();
        })
      })
    ).subscribe()

    this.courseDayForm.get('startTime').valueChanges.pipe(
      combineLatest(timeValueChange),
      map(([value, formValue]) => {
        const time = this.getTimeFromInput(value);
        const momentObject: Moment = moment().hour(+time.hours).minutes(+time.minutes);
        let lessonTime, breakTime;
        const partsCount = this.courseDayForm.value.partsCount;
        lessonTime = this.courseService.choosedCourse.lessonTime;
        breakTime = this.courseService.choosedCourse.breakTime;

        lessonTime = this.getTimeFromInput(lessonTime);
        breakTime = this.getTimeFromInput(breakTime);

        lessonTime = +lessonTime.hours * 60 + +lessonTime.minutes;
        breakTime = +breakTime.hours * 60 + +breakTime.minutes;


        momentObject.add(partsCount * (lessonTime + breakTime), 'minutes');
        if (+momentObject.hours() < +time.hours) {
          return {}
        }

        const minutes = momentObject.get('minutes') < 10 ? `0${momentObject.get('minutes')}` : momentObject.get('minutes');
        const hours = momentObject.get('hours')
        this.courseDayForm.patchValue({ 'endTime': `${hours}:${minutes}` })
      }),
    ).subscribe()
  }

  createCourseCreatingForm(): void {
    this.courseCreatingForm = this.fb.group({
      'name': [this.courseService.choosedCourse.name, Validators.required],
      'key': [this.courseService.choosedCourse.lessonTime, [Validators.required, Validators.minLength(4)]],
      'startDate': [this.courseService.choosedCourse.startDate, Validators.required],
      'endDate': [this.courseService.choosedCourse.endDate, Validators.required],
      'partsCount': [this.courseService.choosedCourse.partsCount, [Validators.required, Validators.min(1)]],
      'lessonTime': [this.courseService.choosedCourse.lessonTime, [Validators.required]],
      'breakTime': [this.courseService.choosedCourse.breakTime, [Validators.required,]]
    });
  }

  createCourseDayForm(): void {
    this.courseDayForm = this.fb.group({
      'day': [new Date(), Validators.required],
      'startTime': ['', [Validators.required]],
      'endTime': ['', [Validators.required]],
      'partsCount': [1, [Validators.required, Validators.min(1)]],
    }, { validator: endTimeValidator });
  }

  updateCourseData() {
    this.courseRest.updateCourse(this.courseService.choosedCourse._id, this.courseCreatingForm.value)
      .subscribe((course) => {
          this.courseService.changeChoosedCourse(course);
          this.courseDays = course.courseDays;
          this.alertService.newAlert('Kurs uaktualniony')

        },
        (err) => {
          this.alertService.newAlert('Wystąpił nieoczekiwany błąd, spróbuj ponownie później', 'danger')
        }
      )
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
    let courseStartDate = Date.parse(<any>this.courseService.choosedCourse.startDate);
    let courseEndDate =Date.parse(<any>this.courseService.choosedCourse.endDate);

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

  getTimeFromInput(time: string): { hours: string, minutes: string } {
    return {
      hours: time.slice(0, 2),
      minutes: time.slice(3, 5)
    };
  }

    updateCourseDays() {
    this.courseRest.updateCourseDays(this.courseService.choosedCourse._id, this.courseDays)
      .subscribe((course) => {
          this.courseService.changeChoosedCourse(course);
          this.courseDays = course.courseDays;
          this.alertService.newAlert('Kurs uaktualniony')
        },
        (err) => {
          this.alertService.newAlert('Wystąpił nieoczekiwany błąd, spróbuj ponownie później', 'danger')
        }
      )
  }
}
