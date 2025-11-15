import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { FileUploadComponent } from '../services/common/file-upload/file-upload.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FileUploadDialogComponent } from './file-upload-dialog/file-upload-dialog.component';
import { MatButton } from '@angular/material/button';
import { SelectNotePdfDialogComponent } from './select-note-pdf-dialog/select-note-pdf-dialog.component';
import { FileUploadModule } from '../services/common/file-upload/file-upload.module';
import {MatCardModule} from '@angular/material/card';



@NgModule({
  declarations: [
    DeleteDialogComponent,
    SelectNotePdfDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButton,
    MatCardModule,
    FileUploadModule
  ]
})
export class DialogModule { }
