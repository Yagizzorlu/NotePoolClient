import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemRoutingModule } from './system-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    NotFoundComponent,
    ForbiddenComponent
  ],
  imports: [
    CommonModule,
    SystemRoutingModule,
    SharedModule // app-empty-state veya ikonlar için
  ]
})
export class SystemModule { }
