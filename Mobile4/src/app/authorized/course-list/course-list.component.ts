import {Component, OnInit} from '@angular/core';
import {CourseRestService} from "../../core/services/course-rest.service";
import {Course} from "../../core/models/course";
import {ModalController} from "@ionic/angular";
import {SignInModalComponent} from "../../sign-in-modal/sign-in-modal.component";

@Component({
    selector: 'app-course-list',
    templateUrl: './course-list.component.html',
    styleUrls: ['./course-list.component.scss']
})
export class CourseListComponent implements OnInit {

    courses: Course[] = [];
    page: number = 1;
    allPages: number;

    constructor(private courseRest: CourseRestService,
                private modalController: ModalController) {
    }

    ngOnInit() {
        this.getCourses();
    }

    getCourses() {
        this.courseRest.getCourses(this.page++)
            .subscribe(
                (courses) => {
                    this.allPages = courses.totalPageCount;
                    this.courses = [...this.courses, ...courses.items]
                },
            )
    }

    async openSignInModal(course) {

        let modal = await this.modalController.create({
            component: SignInModalComponent,
            componentProps: {
                course: course
            }
        });

        return await modal.present();
    }

}
