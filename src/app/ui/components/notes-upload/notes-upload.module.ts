import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotesUploadComponent } from './notes-upload.component';
import { RouterModule } from '@angular/router';
import {MatFormFieldModule} from '@angular/material/form-field'
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import {MatSelectModule} from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { CreateComponent } from './create/create.component';
import { FileUploadModule } from '../../../services/common/file-upload/file-upload.module';


@NgModule({
  declarations: [
    NotesUploadComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
              {path:"", component : NotesUploadComponent}
            ]),
    MatSidenavModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    FileUploadModule
  ]
})
export class NotesUploadModule { }
