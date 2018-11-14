import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthService} from "../core/services/auth.service";
import {UserService} from "../core/services/user.service";
import {confirmPasswordValidator} from "../shared/validators/confirm-password-validator";
import {switchMap} from "rxjs/operators";
import {ToastController} from "@ionic/angular";

@Component({
    selector: 'app-reigster',
    templateUrl: './reigster.page.html',
    styleUrls: ['./reigster.page.scss'],
})
export class ReigsterPage implements OnInit {
    registerForm: FormGroup;

    constructor(private fb: FormBuilder,
                private authService: AuthService,
                private userService: UserService,
                private router: Router,
                private toastController: ToastController) {
        this.createRegisterForm();
    }

    ngOnInit() {
    }

    createRegisterForm() {
        this.registerForm = this.fb.group({
            'firstName': ['', Validators.required],
            'lastName': ['', Validators.required],
            'email': ['', Validators.email],
            'password': ['', Validators.minLength(6)],
            'confirmedPassword': [''],
            'role': ['user']
        }, {validator: confirmPasswordValidator})
    }

    registerUser() {
        this.authService.register(this.registerForm.value)
            .pipe(
                switchMap(() => {
                    const email = this.registerForm.get('email').value;
                    const password = this.registerForm.get('password').value;
                    return this.authService.login({ email, password })
                })
            )
            .subscribe(async (user) => {
                this.userService.loggedUser = { ...user };
                this.router.navigate(['courses']);
                let toast = await this.toastController.create({
                    duration: 3000,
                    position: "top",
                    message: 'Rejestracja zakończona pomyślnie, zostałeś zalogowany.'
                });

                toast.present();

            }, async (err) => {
                let toast = await this.toastController.create({
                    duration: 3000,
                    message: err.error.error || 'Wystąpił błąd, spróbuj ponownie później !',
                    position: "top"
                })

                toast.present();
            })
    }

    roleChange(changeEvent) {
        this.registerForm.patchValue({ role: changeEvent.checked ? 'instructor' : 'user' })
    }

}
