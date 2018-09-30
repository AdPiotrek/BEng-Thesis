import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NavComponent } from './nav/nav.component';
import { AuthGuard } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '', component: NavComponent, canActivate: [AuthGuard], children: [
      { path: '', loadChildren: './course/course.module#CourseModule' },
      { path: 'u', loadChildren: './user/user.module#UserModule' },
      { path: 'i', loadChildren: './instructor/instructor.module#InstructorModule' }
    ]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule
  ]
})
export class AuthorizedRoutingModule {
}
