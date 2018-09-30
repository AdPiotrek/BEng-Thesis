import {Component, OnDestroy, OnInit} from '@angular/core';
import {AlertService} from '../../core/services/alert.service';
import {Alert} from '../../core/models/alert';
import {Subscription} from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit, OnDestroy {

  private alertsSubscription: Subscription;
  alerts: Array<Alert> = [];

  constructor(private alertService: AlertService) {}

  ngOnInit() {
    this.alertsSubscription = this.alertService.alerts.subscribe((alert: Alert) => {
      this.alerts.push(alert)
    })
  }

  ngOnDestroy() {
    this.alertsSubscription.unsubscribe();
  }

  onAlertClose(dismissedAlert: Alert) {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }


}
