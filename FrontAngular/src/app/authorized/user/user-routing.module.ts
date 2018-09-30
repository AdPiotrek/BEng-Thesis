import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserCoursesComponent } from './user-courses/user-courses.component';
import { UserPresenceManagementComponent } from './user-presence-management/user-presence-management.component';
import { UserPresenceListComponent } from './user-presence-list/user-presence-list.component';
import { UserPresenceToggleComponent } from './user-presence-toggle/user-presence-toggle.component';
import { UserPresenceAvailableDaysComponent } from './user-presence-available-days/user-presence-available-days.component';
import { ManagePresencesGuard } from '../../core/guards/manage-presences.guard';

const routes: Routes = [
  { path: ':id/courses', component: UserCoursesComponent },
  {
    path: 'presences',
    component: UserPresenceManagementComponent,
    canActivate: [ManagePresencesGuard],
    children: [
      { path: 'list', component: UserPresenceListComponent },
      { path: 'toggle', component: UserPresenceToggleComponent },
      { path: 'available-days', component: UserPresenceAvailableDaysComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule {
}
