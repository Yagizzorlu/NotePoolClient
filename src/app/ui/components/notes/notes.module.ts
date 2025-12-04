import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../../shared/shared.module';

// Container Component
import { NotesComponent } from './notes.component';

// Page Components
import { NotesListComponent } from './pages/notes-list/notes-list.component';
import { NoteDetailComponent } from './pages/note-detail/note-detail.component';

// Feature Components
import { CommentItemComponent } from './comment-item/comment-item.component';
import { CommentSectionComponent } from './comment-section/comment-section.component';
import { CommentThreadComponent } from './comment-thread/comment-thread.component';
import { FilterPanelComponent } from './filter-panel/filter-panel.component';
import { SortBarComponent } from './sort-bar/sort-bar.component';
import { NoteMetaComponent } from './note-meta/note-meta.component';
import { NotePdfViewerComponent } from './note-pdf-viewer/note-pdf-viewer.component';

@NgModule({
  declarations: [
    // Container
    NotesComponent,
    // Pages
    NotesListComponent,
    NoteDetailComponent,
    // Feature Components
    CommentItemComponent,
    CommentSectionComponent,
    CommentThreadComponent,
    FilterPanelComponent,
    SortBarComponent,
    NoteMetaComponent,
    NotePdfViewerComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: NotesComponent,
        children: [
          { path: '', component: NotesListComponent, data: { animation: 'list' } },
          { path: ':id', component: NoteDetailComponent, data: { animation: 'detail' } }
        ]
      }
    ])
  ]
})
export class NotesModule { }
