import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstitutionsComponent } from './institutions.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    InstitutionsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
          {path:"", component : InstitutionsComponent},
    ])
  ]
})
export class InstitutionsModule { }
