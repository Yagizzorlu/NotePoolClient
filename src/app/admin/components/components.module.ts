import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommentsModule } from './comments/comments.module';
import { CoursesModule } from './courses/courses.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { InstitutionsModule } from './institutions/institutions.module';
import { NotesModule } from './notes/notes.module';
import { UsersModule } from './users/users.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CommentsModule,
    CoursesModule,
    DashboardModule,
    InstitutionsModule,
    NotesModule,
    UsersModule
  ]
})
export class ComponentsModule { }
