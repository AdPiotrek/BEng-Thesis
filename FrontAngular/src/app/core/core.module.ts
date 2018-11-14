import { NgModule } from '@angular/core';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [],
  declarations: [],
  providers: [
    MatMomentDateModule,
    HttpClientModule
  ]
})
export class CoreModule {

}
