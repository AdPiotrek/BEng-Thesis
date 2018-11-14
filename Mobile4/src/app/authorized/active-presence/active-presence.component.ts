import {Component, OnInit} from '@angular/core';
import {UserService} from "../../core/services/user.service";
import {CourseService} from "../../core/services/course.service";
import {UserPresenceService} from "../../core/services/user-presence.service";
import {CourseRestService} from "../../core/services/course-rest.service";
import {ToastController} from "@ionic/angular";
import {CourseDay} from "../../core/models/course-day";
import {switchMap} from "rxjs/operators";

@Component({
    selector: 'app-active-presence',
    templateUrl: './active-presence.component.html',
    styleUrls: ['./active-presence.component.scss']
})
export class ActivePresenceComponent {

    activePresences: CourseDay = null;

    constructor(private userService: UserService,
                private courseService: CourseService,
                private courseRestService: CourseRestService,
                private userPresenceService: UserPresenceService,
                private toastController: ToastController) {
    }



    ionViewWillEnter() {
        this.getActivePresences();
    }

    getActivePresences() {
        console.log('getActivePresence')
        console.log(this.courseService.choosedCourse._id);
        this.courseRestService.getActivePresences(this.courseService.choosedCourse._id)
            .subscribe((courseDay) => {
                console.log(courseDay)
                this.activePresences = courseDay;
            })
    }

    endPresence(courseDay, userId) {
        this.userPresenceService.deletePresences(this.courseService.choosedCourse._id, userId, courseDay)
            .pipe(switchMap(() => {
                return this.courseRestService.getActivePresences(this.courseService.choosedCourse._id);
            }))
            .subscribe(async (courseDay: CourseDay) => {
                let toast = await this.toastController.create({
                    message: 'Obecność usunięta',
                    duration: 3000,
                    position: "top"
                });

                toast.present();
                this.activePresences = courseDay;
            })
    }
}