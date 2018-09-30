import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { LandingRoutingModule } from './landing-routing.module';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatCheckboxModule, MatFormFieldModule, MatInputModule } from '@angular/material';
import { RegisterComponent } from './register/register.component';


@NgModule({
  imports: [
    CommonModule,
    LandingRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule
  ],
  declarations: [
    FooterComponent,
    HeaderComponent,
    LandingPageComponent,
    LoginComponent,
    RegisterComponent
  ]
})
export class LandingModule {
}
