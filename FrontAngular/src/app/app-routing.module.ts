import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/login'},
  { path: '', loadChildren: './landing/landing.module#LandingModule' },
  { path: '', loadChildren: './authorized/authorized.module#AuthorizedModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {enableTracing: true})
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
}
