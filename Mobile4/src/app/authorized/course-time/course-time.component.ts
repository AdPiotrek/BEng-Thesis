import {Component, OnInit} from '@angular/core';
import {LocalNotifications} from "@ionic-native/local-notifications/ngx";

@Component({
    selector: 'app-course-time',
    templateUrl: './course-time.component.html',
    styleUrls: ['./course-time.component.scss']
})
export class CourseTimeComponent implements OnInit {

    leftOfLesson = 120;
    leftOfBreak = 60;
    partsCount = 2;
    realizedLessons = 1;
    realizedBreak = 1;
    lessonInterval;
    breakInterval;


    constructor(private localNotifications: LocalNotifications) {
    }

    ngOnInit() {
    }

    startLesson() {
        this.lessonInterval = setInterval(() => {
            if (this.leftOfLesson > 0) {
                this.leftOfLesson--;
            } else {
                this.leftOfLesson = 2400;
                this.realizedLessons++;
                clearInterval(this.lessonInterval);
                let x = this.localNotifications.schedule({
                    text: `Lekcja nr ${++this.realizedLessons} zrealizowana`,
                    led: '00FF00'
                })
                console.log(x)
            }
        }, 1000)
    }

    endLesson() {
        clearInterval(this.lessonInterval);
    }

    startBreak() {
        this.breakInterval = setInterval(() => {
            if (this.leftOfBreak > 0) {
                this.leftOfBreak--;
            } else {
                this.leftOfBreak = 600;
                this.realizedBreak++;
                clearInterval(this.breakInterval)
            }

        }, 1000)
    }

    endBreak() {
        clearInterval(this.breakInterval)
    }

}
