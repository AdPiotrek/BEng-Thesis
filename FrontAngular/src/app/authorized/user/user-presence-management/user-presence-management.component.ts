import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { timer } from 'rxjs/internal/observable/timer';
import * as moment from 'moment'
import { Observable } from 'rxjs/internal/Observable';
import { Moment } from 'moment';

@Component({
  selector: 'app-user-presence-management',
  templateUrl: './user-presence-management.component.html',
  styleUrls: ['./user-presence-management.component.scss']
})
export class UserPresenceManagementComponent implements OnInit {

  timerObservable: Observable<Moment>;

  links = [
    { url: '/u/presences/list', label: 'Lista obecności' },
    { url: '/u/presences/toggle', label: 'Aktywuj/Dezaktywuj obecność' },
    { url: '/u/presences/available-days', label: 'Dni kursu' }
  ];

  constructor() {
  }

  ngOnInit() {
    this.getServerTime()
  }

  getServerTime() {
    this.timerObservable = timer(0, 1000)
      .pipe(
        map(() => {
          return moment();
        })
      );
  }



}
