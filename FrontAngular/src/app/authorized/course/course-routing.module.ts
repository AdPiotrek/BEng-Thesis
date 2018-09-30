import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CourseContainerComponent } from './course-container/course-container.component';
import { CoursesListComponent } from './courses-list/courses-list.component';
import { AddCourseComponent } from './add-course/add-course.component';

const routes: Routes = [
  {
    path: 'courses', component: CourseContainerComponent, children: [
      { path: '', component: CoursesListComponent },
      { path: 'add', component: AddCourseComponent }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CourseRoutingModule {
}
