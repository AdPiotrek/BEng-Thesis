import {Component, OnInit} from '@angular/core';
import {LocalNotifications} from "@ionic-native/local-notifications/ngx";
import {AlertController} from "@ionic/angular";
import {CourseService} from "../../core/services/course.service";
import {CourseRestService} from "../../core/services/course-rest.service";
import {Storage} from "@ionic/storage";
import {CourseDay} from "../../core/models/course-day";

@Component({
    selector: 'app-course-time',
    templateUrl: './course-time.component.html',
    styleUrls: ['./course-time.component.scss']
})
export class CourseTimeComponent implements OnInit {
    isFirstChange = true;
    hasPreviousState = true;
    isLessonActive = false;
    isBreakActive = false;
    notificationId: 1;
    leftOfLesson: number;
    leftOfBreak: number;
    partsCount: number;
    realizedLessons = 0;
    realizedBreak = 0;
    courseDay: CourseDay;
    courseDays: CourseDay[];
    lessonInterval;
    breakInterval;

    constructor(private localNotifications: LocalNotifications,
                private alertController: AlertController,
                private courseService: CourseService,
                private courseRestService: CourseRestService,
                private storage: Storage) {

    }

    async ngOnInit() {
        const timeObj = await this.storage.get('timeObj');
        if (timeObj && timeObj.courseId === this.courseService.choosedCourse._id) {
            console.log('setting course day')
            this.leftOfLesson = timeObj.leftOfLesson;
            this.leftOfBreak = timeObj.leftOfBreak;
            this.realizedLessons = timeObj.realizedLessons;
            this.realizedBreak = timeObj.realizedBreak;
            this.courseDay = timeObj.courseDay;
        } else {
            this.hasPreviousState = false;
        }

        setInterval(() => {
            this.storage.set('timeObj', {
                leftOfLesson: this.leftOfLesson,
                leftOfBreak: this.leftOfBreak,
                realizedLessons: this.realizedLessons,
                realizedBreak: this.realizedBreak,
                courseDay: this.courseDay || null,
                courseId: this.courseService.choosedCourse._id
            })
        }, 1000 * 20)



    }

    handleSelectChange() {
            console.log('xxxx', this.courseDay);
            if(this.isFirstChange) {
                return
            }
            this.leftOfLesson = this.mapToSecond(this.courseService.choosedCourse.lessonTime);
            this.leftOfBreak = this.mapToSecond(this.courseService.choosedCourse.breakTime);
            this.realizedLessons = 0;
            this.realizedBreak = 0;
            this.partsCount = this.courseDay.partsCount;
    }

    ionViewWillEnter() {
        this.courseRestService.getCourseDays(this.courseService.choosedCourse._id)
            .subscribe(async (courseDays) => {
                this.courseDays = courseDays;
                if (!this.hasPreviousState) {
                    this.courseDay = courseDays[0];
                    this.leftOfLesson = this.mapToSecond(this.courseService.choosedCourse.lessonTime);
                    this.leftOfBreak = this.mapToSecond(this.courseService.choosedCourse.breakTime);
                }
                this.courseDays = courseDays;
            });

    }

    async startLesson() {
        this.endBreak();
        if(this.realizedLessons === this.courseDay.partsCount) {
            let alert = await this. alertController.create({
                header: 'Informacja',
                message: `Wszystkie lekcje zostały zrealizowane`
            });

            alert.present();
        }

        this.isLessonActive = true;
        this.lessonInterval = setInterval(async () => {
            if (this.leftOfLesson > 0) {
                this.leftOfLesson--;
            } else {
                this.leftOfLesson = this.mapToSecond(this.courseService.choosedCourse.lessonTime);
                this.endLesson();
                this.localNotifications.schedule({
                    id: this.notificationId++,
                    text: `Lekcja nr ${++this.realizedLessons} zrealizowana`,
                    led: '00FF00',
                    sound: 'file://assets/sounds/schoolRing.mp3',
                    vibrate: true
                });
                let alert = await this.alertController.create({
                    header: 'Informacja',
                    message: `Lekcja nr ${++this.realizedLessons} zrealizowana`
                });

                alert.present();

            }
        }, 1000)
    }

    endLesson() {
        this.isLessonActive = false;
        clearInterval(this.lessonInterval)
    }

    async startBreak() {

        this.endLesson();

        if(this.realizedBreak === this.courseDay.partsCount) {
            let alert = await this. alertController.create({
                header: 'Informacja',
                message: `Wszystkie przerwy zostały wykorzystane`
            });

            alert.present();
        }

        this.isBreakActive = true;

        this.breakInterval = setInterval(async () => {
            if (this.leftOfBreak > 0) {
                this.leftOfBreak--;
            } else {
                this.leftOfBreak = this.mapToSecond(this.courseService.choosedCourse.breakTime);
                this.endBreak();
                this.localNotifications.schedule({
                    id: this.notificationId++,
                    text: `Przerwa nr ${++this.realizedLessons} zakończona`,
                    led: '00FF00',
                    sound: 'file://assets/sounds/schoolRing.mp3',
                    vibrate: true
                });

                let alert = await this.alertController.create({
                    header: 'Informacja',
                    message: `Przerwa nr ${++this.realizedLessons} zrealizowana`
                });

                alert.present();

            }
        }, 1000)
    }

    endBreak() {
        this.isBreakActive = false;
        clearInterval(this.breakInterval)
    }

    mapToSecond(string): number {
        string = string.replace(':', '').split('');
        let result = 0;

        for(let i = string.length -1; i >=0; --i) {
            result += string[i] * Math.pow(10,string.length - i -1) * 60;
        }

        return result;
    }

    compareFn() {

    }

}
