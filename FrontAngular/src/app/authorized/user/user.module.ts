import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { UserCoursesComponent } from './user-courses/user-courses.component';
import {
  MatButtonModule,
  MatListModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule
} from '@angular/material';
import { UserPresenceManagementComponent } from './user-presence-management/user-presence-management.component';
import { UserPresenceListComponent } from './user-presence-list/user-presence-list.component';
import { UserPresenceToggleComponent } from './user-presence-toggle/user-presence-toggle.component';
import { UserPresenceAvailableDaysComponent } from './user-presence-available-days/user-presence-available-days.component';

@NgModule({
  imports: [
    CommonModule,
    UserRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatListModule,
    MatTabsModule,
    MatButtonModule
  ],
  declarations: [UserCoursesComponent, UserPresenceManagementComponent, UserPresenceListComponent, UserPresenceToggleComponent, UserPresenceAvailableDaysComponent]
})
export class UserModule { }
