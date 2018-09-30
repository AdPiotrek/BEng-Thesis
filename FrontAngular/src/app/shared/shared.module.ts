import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AlertComponent} from './alerts/alert/alert.component';
import {AlertsComponent} from './alerts/alerts.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    AlertsComponent,
    AlertComponent
  ],
  exports: [
    AlertsComponent,
    AlertComponent
  ]
})
export class SharedModule { }
