import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthorizedRoutingModule } from './authorized-routing.module';
import { NavComponent } from './nav/nav.component';
import {
  MatButtonModule,
  MatExpansionModule,
  MatIconModule,
  MatListModule,
  MatSidenavModule,
  MatTabsModule,
  MatToolbarModule
} from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    AuthorizedRoutingModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    LayoutModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatTabsModule,
    SharedModule
  ],
  declarations: [
    NavComponent
  ]
})

export class AuthorizedModule {
}
