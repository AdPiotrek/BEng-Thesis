import {Component, OnInit} from '@angular/core';
import {LocalNotifications} from "@ionic-native/local-notifications/ngx";

@Component({
    selector: 'app-course-time',
    templateUrl: './course-time.component.html',
    styleUrls: ['./course-time.component.scss']
})
export class CourseTimeComponent implements OnInit {

    notificationId: 1;
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

        this.localNotifications.requestPermission()
            .then(() => {
                this.localNotifications.schedule({
                    text: 'xDDD',
                    id: this.notificationId++,
                    sound: 'file://assets/sounds/schoolRing.mp3'
                })
            });

        this.localNotifications.requestPermission()
            .then(() => console.log('xD'))


    }

    startLesson() {
        console.log('lessonStarted')
        this.lessonInterval = setInterval(async () => {
            if (this.leftOfLesson > 0) {
                this.leftOfLesson--;
            } else {
                this.leftOfLesson = 2400;
                this.realizedLessons++;
                clearInterval(this.lessonInterval);
                console.log(this.localNotifications);
                this.localNotifications.schedule({
                    id: this.notificationId++,
                    text: `Lekcja nr ${++this.realizedLessons} zrealizowana`,
                    led: '00FF00',
                    sound: 'file://assets/sounds/schoolRing.mp3',
                    vibrate: true
                });

                console.log(this.localNotifications.getTriggered('1'));

                console.log(await this.localNotifications.getAll());
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
