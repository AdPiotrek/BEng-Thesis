import {Component, Input, OnInit} from '@angular/core';
import {AddUserToCourseRequest} from "../../../../FrontAngular/src/app/core/models/add-user-to-course-request";
import {UserService} from "../core/services/user.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Course} from "../core/models/course";
import {CourseRestService} from "../core/services/course-rest.service";
import {ModalController, ToastController} from "@ionic/angular";

@Component({
    selector: 'app-sign-in-modal',
    templateUrl: './sign-in-modal.component.html',
    styleUrls: ['./sign-in-modal.component.scss']
})
export class SignInModalComponent implements OnInit {
    @Input() course: Course;
    signInToCourseForm: FormGroup;

    constructor(private userService: UserService,
                private fb: FormBuilder,
                private courseRest: CourseRestService,
                private toastController: ToastController,
                private modalCtrl: ModalController) {
        this.createSignInToCourseForm();
    }

    ngOnInit() {
    }

    createSignInToCourseForm() {
        this.signInToCourseForm = this.fb.group({
            'password': ['', [Validators.minLength(4), Validators.required]]
        })
    }

    signInToCourse() {

        const req: AddUserToCourseRequest = {
            userId: this.userService.loggedUser._id,
            key: this.signInToCourseForm.value.password
        };

        console.log(req)

        this.courseRest.addUserToCourse(this.course._id, req)
            .subscribe(
                async () => {
                    let toast = await this.toastController.create({
                        position: "top",
                        message: 'Zostałeś dopisany do kursu!',
                        duration: 3000
                    });

                    toast.present();
                    this.closeModal();

                },
                async (err) => {
                    let toast = await this.toastController.create({
                        position: "top",
                        message: err.error.message,
                        duration: 3000
                    });

                    toast.present();

                }
            )
    }

    async closeModal() {
        console.log('modal controller')
        await this.modalCtrl.dismiss();
    }

}
