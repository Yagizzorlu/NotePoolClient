import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; 
import { NoteUploadComponent } from './note-upload.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    NoteUploadComponent // <--- Sadece bu component declare edilir
  ],
  imports: [
    CommonModule,
    SharedModule,          // Tüm UI parçaları ve form direktifleri
    FormsModule,
    ReactiveFormsModule,   // Formlar için şart
    
    // Routing
    RouterModule.forChild([
      { path: "", component: NoteUploadComponent } // /notes-upload -> bu component'i yükle
    ])
  ]
})
export class NoteUploadModule { }