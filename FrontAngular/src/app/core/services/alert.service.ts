import { Injectable } from '@angular/core';
import {Subject} from 'rxjs/internal/Subject';
import {Observable} from 'rxjs/internal/Observable';
import {Alert} from '../models/alert';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  private alertSubject = new Subject<Alert>();
  public  alerts: Observable<Alert> = this.alertSubject.asObservable();

  constructor() { }

  newAlert(text: string, type: string = 'success', lifetime: number = 3000, closeOnIcon: boolean = true) {
    const newAlert: Alert = {
      message: text,
      type: type,
      lifetime: lifetime,
      closeOnIcon: closeOnIcon
    };
    this.alertSubject.next(newAlert);
  }

}
