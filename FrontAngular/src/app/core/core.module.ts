import { ModuleWithProviders, NgModule } from '@angular/core';

import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { HttpClientModule } from '@angular/common/http';
import {SharedModule} from '../shared/shared.module';

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
