import {Component, OnInit} from '@angular/core';
import {catchError, tap} from "rxjs/operators";
import {UserPresenceService} from "../../core/services/user-presence.service";
import {UserService} from "../../core/services/user.service";
import {CourseService} from "../../core/services/course.service";
import {ToastController} from "@ionic/angular";
import {Observable} from "rxjs/internal/Observable";
import {of} from "rxjs/internal/observable/of";
import {CourseDay} from "../../core/models/course-day";

@Component({
    selector: 'app-toggle-presence',
    templateUrl: './toggle-presence.component.html',
    styleUrls: ['./toggle-presence.component.scss']
})
export class TogglePresenceComponent implements OnInit {

    activePresence$: Observable<CourseDay>;
    activePresence: CourseDay;

    constructor(private userPresence: UserPresenceService,
                private userService: UserService,
                private courseService: CourseService,
                private toastController: ToastController) {
    }

    ngOnInit() {
        this.getActivePresence();
    }

    getActivePresence() {
        this.activePresence$ = this.userPresence.hasActivePresence(this.userService.loggedUser._id, this.courseService.choosedCourse._id)
            .pipe(
                tap((userPresence: CourseDay) => {
                    this.activePresence = userPresence;
                })
            )
    }

    startPresence() {
        return this.userPresence.startPresence(this.courseService.choosedCourse._id, this.userService.loggedUser._id)
            .pipe(
                tap(() => this.getActivePresence()),
                catchError(async (err) => {
                    let toast = await this.toastController.create({
                        message: 'Nie można teraz aktywować obecnośći',
                        position: "top",
                        duration: 3000
                    });

                    toast.present();

                    return of(null)
                })
            ).subscribe()
    }
}
