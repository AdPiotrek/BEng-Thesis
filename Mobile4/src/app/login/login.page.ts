import {Component, OnInit} from '@angular/core';
import {User} from "../../../../FrontAngular/src/app/core/models/user";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../core/services/auth.service";
import {UserService} from "../core/services/user.service";
import {ToastController} from "@ionic/angular";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

    loginForm: FormGroup;

    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private userService: UserService,
                private toastController: ToastController,
                private router: Router) {
        this.createLoginForm();
    }

    ngOnInit() {
    }

    createLoginForm() {
        this.loginForm = this.fb.group({
            'email': ['', [Validators.required, Validators.email]],
            'password': ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    signIn() {
        this.authService.login(this.loginForm.value)
            .subscribe(
                async (user: User) => {
                    this.userService.loggedUser = {...user};
                    this.router.navigate(['course-list'])
                },
                async (err) => {
                    let toast = await this.toastController.create({
                        message: 'Niepoprawny email lub hasło, spróbuj ponownie',
                        position: "top",
                        duration: 3000
                    });

                    toast.present();
                }
            )
    }
}
