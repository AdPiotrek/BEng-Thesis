import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { confirmPasswordValidator } from '../../shared/validators/confirm-password-validator';
import { ErrorStateMatcher, MatCheckboxChange } from '@angular/material';
import { ConfirmPasswordErrorStateMatcher } from '../../shared/error-matchers/confirm-password-error-state-matcher';
import { AuthService } from '../../core/services/auth.service';
import { AlertService } from '../../core/services/alert.service';
import { map, switchMap } from 'rxjs/operators';
import { UserService } from '../../core/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm: FormGroup;
  confirmPasswordErrorMatcher: ErrorStateMatcher = new ConfirmPasswordErrorStateMatcher();

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private alertService: AlertService,
              private userService: UserService,
              private router: Router) {
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
    }, { validator: confirmPasswordValidator })
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
      .subscribe((user) => {
        this.userService.loggedUser = { ...user };
        if(this.userService.loggedUser.role === 'instructor') {
          this.router.navigate(['courses/add'])
        }
        this.router.navigate(['courses']);
        this.alertService.newAlert('Rejestracja zakończona pomyślnie, zostałeś zalogowany', 'success', 5000)
      }, (err) => {
        console.log('xD');
        console.log('err');
        this.alertService.newAlert('Wystąpił błąd, spróbuj ponownie później.', 'danger', 5000)
      })
  }

  roleChange(changeEvent: MatCheckboxChange) {
    this.registerForm.patchValue({ role: changeEvent.checked ? 'instructor' : 'user' })
  }

}
