import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user';
import { AlertService } from '../../core/services/alert.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private userService: UserService,
              private alertService: AlertService,
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
        (user: User) => {
          this.userService.loggedUser = { ...user };
          if (user.role === 'instructor') {
            this.router.navigate(['courses'])
          } else {
            this.router.navigate([user._id, 'courses'])
          }
        },
        (err) => {
          console.log(err);
          this.alertService.newAlert('Niepoprawny email lub hasło, spróbuj ponownie', 'danger', 5000);
        }
      )
  }
}
