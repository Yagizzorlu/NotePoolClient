import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesComponent } from './courses.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    CoursesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
          {path:"", component : CoursesComponent}
    ])
  ]
})
export class CoursesModule { }
