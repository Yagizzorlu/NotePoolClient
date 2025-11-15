import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesComponent } from './notes.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NotesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path:"",component:NotesComponent}
    ])
  ]
})
export class NotesModule { }
