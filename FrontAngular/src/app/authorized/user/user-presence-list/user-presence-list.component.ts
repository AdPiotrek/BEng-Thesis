import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CourseRestService } from '../../course/services/course-rest.service';
import { UserRestService } from '../services/user-rest.service';
import { UserService } from '../../../core/services/user.service';
import { CourseService } from '../services/course.service';
import { map, switchMap, tap } from 'rxjs/operators';
import { Course } from '../../../core/models/course';
import { Observable } from 'rxjs/internal/Observable';
import { UserPresence } from '../../../core/models/user-presence';
import { UserPresenceService } from '../services/user-presence.service';
import * as jsPDF from 'jspdf';
import * as moment from 'moment'
import { CourseDay } from '../../../core/models/course-day';

@Component({
  selector: 'app-user-presence-list',
  templateUrl: './user-presence-list.component.html',
  styleUrls: ['./user-presence-list.component.scss']
})
export class UserPresenceListComponent implements OnInit {

  userPresences$: Observable<CourseDay[]>;
  userPresences: CourseDay[];

  @ViewChild('pdfContent') pdfContent: ElementRef;

  constructor(public userService: UserService,
              public courseService: CourseService,
              public userRest: UserRestService,
              ) {
  }

  getUserPresences() {
    this.userPresences$ = this.userRest.getPresences(this.userService.loggedUser._id, this.courseService.choosedCourse._id)
      .pipe(tap((val) => {
        this.userPresences = val;
      }))
  }

  ngOnInit() {
    this.getUserPresences();
  }

  refreshContent() {

  }

  downloadPDF() {
    let doc = new jsPDF();

    console.log(this.pdfContent)

    let specialElementHandlers = {
      '#editor': (element, render) => {
        return true;
      }
    }

    let content = `<h1>Lista obecnosci uzytkownika :${this.userService.loggedUser.firstName} - ${this.userService.loggedUser.lastName}</h1>`;
    content += `<h2>W kursie ${this.courseService.choosedCourse.name}: <h2>`;

    this.userPresences.forEach((userPresence, index) => {
      const day = moment(userPresence.startTime).format('DD MM YYYY')
      const startDate = moment(userPresence.startTime).format('HH mm');
      const endDate = moment(userPresence.endTime).format('HH mm');
      content += `#${index}: ${day} -  ${startDate} do ${endDate}<br/>`
    })

    doc.fromHTML(content, 15, 15, {
      'width': 500,
      'elementHandlers': specialElementHandlers
    })



    doc.save(`${this.userService.loggedUser.firstName}-${this.userService.loggedUser.lastName}-${this.courseService.choosedCourse.name}`)
  }


}
