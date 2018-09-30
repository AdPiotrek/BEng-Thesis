import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { timer } from 'rxjs/internal/observable/timer';
import * as moment from 'moment'
import { Observable } from 'rxjs/internal/Observable';
import { Moment } from 'moment';
import { UserPresenceToggleComponent } from '../user-presence-toggle/user-presence-toggle.component';
import { UserPresenceListComponent } from '../user-presence-list/user-presence-list.component';
import { UserPresenceAvailableDaysComponent } from '../user-presence-available-days/user-presence-available-days.component';

@Component({
  selector: 'app-user-presence-management',
  templateUrl: './user-presence-management.component.html',
  styleUrls: ['./user-presence-management.component.scss']
})
export class UserPresenceManagementComponent implements OnInit {

  childRef: UserPresenceToggleComponent | UserPresenceListComponent | UserPresenceAvailableDaysComponent;

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

  changeChildRef(childRef) {
    this.childRef = childRef;
  }

  refreshChildContent() {
    this.childRef.refreshContent()
  }

}
