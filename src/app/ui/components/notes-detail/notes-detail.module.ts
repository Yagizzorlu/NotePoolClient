import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesDetailComponent } from './notes-detail.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    NotesDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
          {path:"", component : NotesDetailComponent}
        ])
  ]
})
export class NotesDetailModule { }
