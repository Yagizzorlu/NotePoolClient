import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // routerLink için şart
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxFileDropModule } from 'ngx-file-drop'; // File Upload için

// --- MATERIAL MODULES ---
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

// --- PIPES ---
import { TimeAgoPipe } from './pipes/time-ago.pipe';
import { TruncatePipe } from './pipes/truncate.pipe';
import { SafeResourceUrlPipe } from './pipes/safe-resource-url.pipe';

// --- DIRECTIVES ---
import { DeleteDirective } from './directives/delete.directive';
import { NoteCardComponent } from './note-card/note-card.component';
import { UserAvatarComponent } from './user-avatar/user-avatar.component';
import { ReactionButtonComponent } from './reaction-button/reaction-button.component';
import { PaginationComponent } from './pagination/pagination.component';
import { EmptyStateComponent } from './empty-state/empty-state.component';
import { SkeletonLoaderComponent } from './skeleton-loader/skeleton-loader.component';
import { FormErrorMessagesComponent } from './form-error-messages/form-error-messages.component';
import { FileUploadComponent } from '../services/common/file-upload/file-upload.component';
import { SearchBarComponent } from '../ui/components/search-bar/search-bar.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { DeleteDialogComponent } from '../dialogs/delete-dialog/delete-dialog.component';
import { FileUploadDialogComponent } from '../dialogs/file-upload-dialog/file-upload-dialog.component';
import { SelectNotePdfDialogComponent } from '../dialogs/select-note-pdf-dialog/select-note-pdf-dialog.component';
import { UpdateCommentDialogComponent } from '../dialogs/update-comment-dialog/update-comment-dialog.component';

const DECLARATIONS = [
  // UI Components
  NoteCardComponent,
  UserAvatarComponent,
  ReactionButtonComponent,
  PaginationComponent,
  EmptyStateComponent,
  SkeletonLoaderComponent,
  FormErrorMessagesComponent,
  FileUploadComponent,
  SearchBarComponent,
  LoadingSpinnerComponent,

  // Dialogs
  DeleteDialogComponent,
  FileUploadDialogComponent,
  SelectNotePdfDialogComponent,
  UpdateCommentDialogComponent,

  // Pipes & Directives
  TimeAgoPipe,
  TruncatePipe,
  SafeResourceUrlPipe,
  DeleteDirective
];

const MODULES = [
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule,
  NgxFileDropModule,
  MatDialogModule,
  MatButtonModule,
  MatIconModule,
  MatCardModule
];

@NgModule({
  declarations: [
    ...DECLARATIONS
  ],
  imports: [
    ...MODULES
  ],
  exports: [
    ...DECLARATIONS,
    ...MODULES // Modülleri de dışarı açıyoruz ki kullananlar tekrar import etmesin
  ]
})
export class SharedModule { }

