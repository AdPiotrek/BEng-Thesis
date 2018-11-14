import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {ReigsterPage} from "./reigster/reigster.page";
import {LoginPage} from "./login/login.page";
import {AuthorizedComponent} from "./authorized/authorized/authorized.component";
import {CourseListComponent} from "./authorized/course-list/course-list.component";
import {AuthGuard} from "./core/guards/auth.guard";
import {MyCourseListComponent} from "./authorized/my-course-list/my-course-list.component";
import {TogglePresenceComponent} from "./authorized/toggle-presence/toggle-presence.component";
import {ActivePresenceComponent} from "./authorized/active-presence/active-presence.component";
import {CourseTimeComponent} from "./authorized/course-time/course-time.component";

const routes: Routes = [
    {path: '', redirectTo: 'register', pathMatch: 'full'},
    {path: 'register', component: ReigsterPage},
    {path: 'login', component: LoginPage},
    {
        path: '', component: AuthorizedComponent, canActivate: [AuthGuard], children: [
            {path: 'course-list', component: CourseListComponent},
            {path: 'my-courses', component: MyCourseListComponent},
            {path: 'user-presence', component: TogglePresenceComponent},
            {path: 'active-presence', component: ActivePresenceComponent},
            {path: 'time-control', component: CourseTimeComponent}
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
