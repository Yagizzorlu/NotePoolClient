import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { HomeModule } from './home/home.module';
import { NotesModule } from './notes/notes.module';
import { NotesDetailModule } from './notes-detail/notes-detail.module';
import { ProfilesModule } from './profiles/profiles.module';
import { NotesUploadModule } from './notes-upload/notes-upload.module';
import { RegisterComponent } from './register/register.component';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';
import { SearchBarComponent } from './search-bar/search-bar.component';



@NgModule({
  declarations: [
  
    SearchBarComponent
  ],
  imports: [
    CommonModule,
    BookmarksModule,
    HomeModule,
    NotesModule,
    NotesUploadModule,
    NotesDetailModule,
    ProfilesModule,
    RegisterModule,
    //LoginModule
  ]
})
export class ComponentsModule { }
