import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseRestService } from '../services/course-rest.service';
import { Course } from '../../../core/models/course';
import { CourseDay } from '../../../core/models/course-day';
import { AlertService } from '../../../core/services/alert.service';
import { endTimeValidator } from '../../../shared/validators/end-time-validator';

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

  constructor(private fb: FormBuilder,
              private courseRest: CourseRestService,
              private alertService: AlertService) {
    this.createCourseCreatingForm();
    this.createCourseDayForm();
  }

  ngOnInit() {
  }


  createCourseCreatingForm(): void {
    this.courseCreatingForm = this.fb.group({
      'name': ['', Validators.required],
      'key': ['', [Validators.required, Validators.minLength(4)]],
      'startDate': [new Date().setHours(0,0,0), Validators.required],
      'endDate': [new Date().setHours(0,0,0), Validators.required],
      'partsCount': [1, [Validators.required, Validators.min(1)]],
      'lessonTime': ['00:45', [Validators.required]],
      'breakTime': ['00:15', [Validators.required,]]
    });
  }

  createCourseDayForm(): void {
    this.courseDayForm = this.fb.group({
      'day': [new Date(), Validators.required],
      'startTime': ['', [Validators.required]],
      'endTime': ['', [Validators.required]]
    }, { validator: endTimeValidator });
  }

  addCourseDay(): void {
    const courseDay: CourseDay = this.createCourseDay();
    console.log(!this.isCourseDayInsideCourseDays(courseDay));
    if(!this.isCourseDayInsideCourseDays(courseDay)){
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
    this.courseRest.addCourse(course)
      .subscribe(
        (x) => {
          this.courseCreatingForm.reset();
          this.courseDayForm.reset();
          this.courseDays = [];
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

    return {
      startTime: new Date(day).setHours(+dayStartTime.hours, +dayStartTime.minutes),
      endTime: new Date(day).setHours(+dayEndTime.hours, +dayEndTime.minutes)
    }
  }

  isCourseDayInsideCourseDays(courseDay: CourseDay): boolean {
    let courseStartDate = this.courseCreatingForm.get('startDate').value;
    let courseEndDate = this.courseCreatingForm.get('endDate').value;

    console.log(typeof courseStartDate)

    if(typeof courseStartDate === 'object') {
      courseStartDate = Date.parse(courseStartDate)
    }
    if (typeof courseEndDate === 'object') {
      courseEndDate = Date.parse(courseEndDate)
    }

    // console.log(courseDay.startTime, courseStartDate)
    // console.log(courseDay.endTime, courseEndDate + 24 * 3600 * 1000);
    // console.log(courseDay.startTime >= courseStartDate)
    // console.log(courseDay.endTime <= courseEndDate + (24 * 3600 * 1000));

    return courseDay.startTime >= courseStartDate && courseDay.endTime <= courseEndDate + 24 * 3600 * 1000 -1 ;
  }

  deletePresence(courseDay) {
    console.log(courseDay)
    this.courseDays = this.courseDays.filter((day) => day !== courseDay)
  }




}
