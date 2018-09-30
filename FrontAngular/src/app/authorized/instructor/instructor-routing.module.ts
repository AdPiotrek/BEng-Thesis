import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddUserComponent } from './add-user/add-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { CourseActivePresencesComponent } from './course-active-presences/course-active-presences.component';
import { EditUserPresencesComponent } from './edit-user-presences/edit-user-presences.component';
import { ManagePresencesGuard } from '../../core/guards/manage-presences.guard';

const routes: Routes = [
  { path: 'add-user', canActivate: [ManagePresencesGuard], component: AddUserComponent },
  { path: 'users-list', canActivate: [ManagePresencesGuard], component: UserListComponent },
  { path: 'course-active-presences', canActivate: [ManagePresencesGuard], component: CourseActivePresencesComponent },
  { path: 'edit-user-presences/:id', canActivate: [ManagePresencesGuard], component: EditUserPresencesComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InstructorRoutingModule {
}
