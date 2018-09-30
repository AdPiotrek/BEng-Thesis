import { Component, OnInit } from '@angular/core';
import { CourseService } from '../../user/services/course.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InstructorRestService } from '../services/instructor-rest.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {

  addToCourseForm: FormGroup;

  constructor(private courseService: CourseService,
              private fb: FormBuilder,
              private instructorRest: InstructorRestService,
              private alertService: AlertService) {
    this.createForm();
  }

  ngOnInit() {
  }

  addUserToCourse() {
    this.instructorRest.addUserToCourse(this.courseService.choosedCourse._id, this.addToCourseForm.value.email)
      .subscribe({
        next: () => {
          this.alertService.newAlert('Użytkownik dodany do kursu')
        },
        error: (err) => {
          console.log(err)
          this.alertService.newAlert(err.error.message, 'danger', 3000)
        }
      })

  }

  createForm() {
    this.addToCourseForm = this.fb.group({
      'email': ['', [Validators.required, Validators.email]]
    })
  }

}
