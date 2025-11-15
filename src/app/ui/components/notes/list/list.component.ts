import { SelectNotePdfDialogComponent } from './../../../../dialogs/select-note-pdf-dialog/select-note-pdf-dialog.component';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { List_Note } from '../../../../contracts/list_note';
import { NoteService } from '../../../../services/common/models/note.service';
import { BaseComponent, SpinnerType } from '../../../../base/base.component';
import { AlertifyService, MessageType, Position } from '../../../../services/admin/alertify.service';
import { MatPaginator } from '@angular/material/paginator';
import { DialogService } from '../../../../services/common/dialog.service';
declare var $: any

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(spinner : NgxSpinnerService, private noteService : NoteService, private alertifyService :
    AlertifyService, private dialogService : DialogService) {
    super(spinner)
  }

  displayedColumns: string[] = ['title', 'description', 'tags', 'userId','courseId','institutionId',
    'createdDate','updatedDate','pdfFile','edit','delete'];

  dataSource : MatTableDataSource<List_Note> = null;
  notes: List_Note[] = [];
  totalCount: number = 0;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Placeholder data for like/dislike/comment counts
  noteStats: { [key: string]: { likes: number; dislikes: number; comments: number; isLiked: boolean; isDisliked: boolean } } = {};

  async getNotes() {
    this.showSpinner(SpinnerType.BallScale);
    const allNotes : {totalCount : number;
      notes: List_Note[]} = await this.noteService.read(this.paginator ? 
      this.paginator.pageIndex : 0, this.paginator ?
      this.paginator.pageSize :5 ,   ()=> this.hideSpinner(SpinnerType.BallScale), errorMessage => 
      this.alertifyService.message(errorMessage, {
        dismissOthers : true,
        messageType : MessageType.Error,
        position : Position.TopRight
      }))
      this.notes = allNotes.notes;
      this.totalCount = allNotes.totalCount;
      this.dataSource = new MatTableDataSource<List_Note>(allNotes.notes);
      this.paginator.length = allNotes.totalCount;
      
      // Initialize stats for each note
      allNotes.notes.forEach(note => {
        if (!this.noteStats[note.id]) {
          this.noteStats[note.id] = {
            likes: Math.floor(Math.random() * 100),
            dislikes: Math.floor(Math.random() * 20),
            comments: Math.floor(Math.random() * 50),
            isLiked: false,
            isDisliked: false
          };
        }
      });
  }

  likeNote(noteId: string) {
    const stats = this.noteStats[noteId];
    if (stats.isLiked) {
      stats.likes--;
      stats.isLiked = false;
    } else {
      if (stats.isDisliked) {
        stats.dislikes--;
        stats.isDisliked = false;
      }
      stats.likes++;
      stats.isLiked = true;
    }
  }

  dislikeNote(noteId: string) {
    const stats = this.noteStats[noteId];
    if (stats.isDisliked) {
      stats.dislikes--;
      stats.isDisliked = false;
    } else {
      if (stats.isLiked) {
        stats.likes--;
        stats.isLiked = false;
      }
      stats.dislikes++;
      stats.isDisliked = true;
    }
  }

  downloadNote(noteId: string) {
    // Download functionality - placeholder
    this.alertifyService.message('İndiriliyor...', {
      dismissOthers: true,
      messageType: MessageType.Notify,
      position: Position.TopRight
    });
  }

  showComments(noteId: string) {
    // Comments functionality - placeholder
    this.alertifyService.message('Yorumlar açılıyor...', {
      dismissOthers: true,
      messageType: MessageType.Notify,
      position: Position.TopRight
    });
  }

  addNotePdfs(id : string) {
    this.dialogService.openDialog({
      componentType:SelectNotePdfDialogComponent,
      data : id,
      options : {
        width : "1400px"
      }
    });
  }

  async pageChanged() {
    await this.getNotes();
  }


  async ngOnInit() {
    await this.getNotes();
  }

}
