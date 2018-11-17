import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouteReuseStrategy} from '@angular/router';

import {IonicModule, IonicRouteStrategy} from '@ionic/angular';
import {SplashScreen} from '@ionic-native/splash-screen/ngx';
import {StatusBar} from '@ionic-native/status-bar/ngx';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {ReactiveFormsModule} from "@angular/forms";
import {ReigsterPage} from "./reigster/reigster.page";
import {LoginPage} from "./login/login.page";
import {AuthorizedComponent} from "./authorized/authorized/authorized.component";
import {CourseListComponent} from "./authorized/course-list/course-list.component";
import {TokenInterceptor} from "./core/services/token-interceptor.service";
import { SignInModalComponent } from './sign-in-modal/sign-in-modal.component';
import { MyCourseListComponent } from './authorized/my-course-list/my-course-list.component';
import { ActivePresenceComponent } from './authorized/active-presence/active-presence.component';
import { TogglePresenceComponent } from './authorized/toggle-presence/toggle-presence.component';
import { CourseTimeComponent } from './authorized/course-time/course-time.component';
import { SecondsToTimePipe } from './shared/seconds-to-time.pipe';
import {LocalNotifications} from "@ionic-native/local-notifications/ngx";

@NgModule({
    declarations: [
        AppComponent,
        ReigsterPage,
        LoginPage,
        AuthorizedComponent,
        CourseListComponent,
        SignInModalComponent,
        MyCourseListComponent,
        ActivePresenceComponent,
        TogglePresenceComponent,
        CourseTimeComponent,
        SecondsToTimePipe,

    ],
    entryComponents: [
        SignInModalComponent
    ],
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        IonicModule.forRoot(),
        AppRoutingModule,
        HttpClientModule,
    ],
    providers: [
        StatusBar,
        SplashScreen,
        LocalNotifications,
        {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
        {provide: RouteReuseStrategy, useClass: IonicRouteStrategy}
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
