import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarksComponent } from './bookmarks.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    BookmarksComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
          {path:"", component : BookmarksComponent}
        ])
  ]
})
export class BookmarksModule { }
