import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { CourseRoutingModule } from './course-routing.module';
import { CourseContainerComponent } from './course-container/course-container.component';
import { AddCourseComponent } from './add-course/add-course.component';
import { CoursesListComponent } from './courses-list/courses-list.component';
import { CourseListItemComponent } from './course-list-item/course-list-item.component';
import {
  MatButtonModule,
  MatDatepickerModule, MatDialogModule,
  MatFormFieldModule, MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule, MatSortModule,
  MatTableModule,
  MatTabsModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CourseDayPipe } from '../../core/course-day.pipe';
import { SignToCourseDialogComponent } from './sign-to-course-dialog/sign-to-course-dialog.component';
import { CourseEditComponent } from './course-edit/course-edit.component';


@NgModule({
  imports: [
    CommonModule,
    CourseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatDialogModule,
    MatIconModule,
  ],
  declarations: [
    CourseContainerComponent,
    AddCourseComponent,
    CoursesListComponent,
    CourseListItemComponent,
    CourseDayPipe,
    SignToCourseDialogComponent,
    CourseEditComponent
  ],
  providers: [
    DatePipe
  ],
  entryComponents: [
    SignToCourseDialogComponent
  ]
})
export class CourseModule {
}
