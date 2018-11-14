import { Component, OnInit } from '@angular/core';
import {ToastController} from "@ionic/angular";
import {Course} from "../../core/models/course";
import {UserRestService} from "../../core/services/user-rest.service";
import {UserService} from "../../core/services/user.service";
import {Pagination} from "../../core/models/pagination";
import {CourseService} from "../../core/services/course.service";

@Component({
  selector: 'app-my-course-list',
  templateUrl: './my-course-list.component.html',
  styleUrls: ['./my-course-list.component.scss']
})
export class MyCourseListComponent implements OnInit {

    courses: Course[] = [];
    allPages: number;

    constructor(private userRest: UserRestService,
                private userService: UserService,
                private courseService: CourseService,
                private toastCtrl: ToastController) {
    }

    ngOnInit() {
        this.getCourses();
    }

    getCourses() {
        this.userRest.getUserCourses(this.userService.loggedUser._id)
            .subscribe(
                (courses: Pagination<Course>) => {
                    this.allPages = courses.totalPageCount;
                    this.courses = [...this.courses, ...courses.items]
                },
            )
    }

    async signIn(course: Course) {
        this.courseService.choosedCourse = course;
        let toast = await this.toastCtrl.create({
            message: 'Zostałeś zalogowany do kursu',
            position: "top",
            duration: 3000
        });

        toast.present();
    }

}
