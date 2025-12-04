import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarksComponent } from './bookmarks.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';



@NgModule({
  declarations: [
    BookmarksComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
          {path:"", component : BookmarksComponent}
        ])
  ]
})
export class BookmarksModule { }
