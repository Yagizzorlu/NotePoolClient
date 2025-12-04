import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { HomeModule } from './home/home.module';
import { NotesModule } from './notes/notes.module';
import { ProfileModule } from './profile/profile.module';
import { NoteUploadModule } from './note-upload/note-upload.module';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';



@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    BookmarksModule,
    HomeModule,
    NotesModule,
    NoteUploadModule,
    ProfileModule,
    RegisterModule,
    LoginModule
  ]
})
export class ComponentsModule { }
