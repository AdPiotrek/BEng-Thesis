import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InstructorRoutingModule } from './instructor-routing.module';
import { AddUserComponent } from './add-user/add-user.component';
import {
  MatButtonModule,
  MatCardModule, MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule, MatListModule, MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule
} from '@angular/material';
import { UserListComponent } from './user-list/user-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DeleteUserDialogComponent } from './user-list/delete-user-dialog/delete-user-dialog.component';
import { CourseActivePresencesComponent } from './course-active-presences/course-active-presences.component';
import { EditUserPresencesComponent } from './edit-user-presences/edit-user-presences.component';

@NgModule({
  imports: [
    CommonModule,
    InstructorRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  declarations: [AddUserComponent, UserListComponent, DeleteUserDialogComponent, CourseActivePresencesComponent, EditUserPresencesComponent],
  entryComponents: [
    DeleteUserDialogComponent
  ]
})
export class InstructorModule {

}
