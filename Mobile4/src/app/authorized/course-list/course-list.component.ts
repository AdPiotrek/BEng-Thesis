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
export class CourseListComponent {
    firstEnter = true;
    courses: Course[] = [];
    page: number = 0;
    allPages: number;
    searchPhrase = '';
    constructor(private courseRest: CourseRestService,
                private modalController: ModalController) {
    }


    searchCourse() {
        this.page = 0;
        this.courses = [];
        this.getCourses();
    }

    ionViewWillEnter() {
        console.log('[COURSE_LIST ON INIT]');
        if (this.firstEnter) {
            this.getCourses();
        }
    }

    getCourses() {
        console.log(this.searchPhrase)
        this.courseRest.getCourses(this.page++, this.searchPhrase)
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
