import { Component, Inject, OnInit, Output } from '@angular/core';
import { BaseDialog } from '../base/base-dialog';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FileUploadOptions } from '../../services/common/file-upload/file-upload.component';
import { NoteService } from '../../services/common/models/note.service';
import { List_Note_File } from '../../contracts/list_note_file';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { MatCard } from '@angular/material/card';
import { DialogService } from '../../services/common/dialog.service';
import { DeleteDialogComponent, DeleteState } from '../delete-dialog/delete-dialog.component';

declare var $: any


@Component({
  selector: 'app-select-note-pdf-dialog',
  templateUrl: './select-note-pdf-dialog.component.html',
  styleUrl: './select-note-pdf-dialog.component.scss'
})
export class SelectNotePdfDialogComponent extends BaseDialog<SelectNotePdfDialogComponent> 
implements OnInit{

  constructor(dialogRef : MatDialogRef<SelectNotePdfDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data : SelectNotePdfState 
    | string, private noteService : NoteService, private spinner : NgxSpinnerService, private dialogService : DialogService) {
    super(dialogRef)
  }

  @Output() options : Partial<FileUploadOptions> = {
    accept : ".pdf",
    action : "upload",
    controller : "notes",
    explanation : "Ürün resmini seçin veya buraya sürükleyin.",
    isAdminPage : false,
    queryString : `id=${this.data}`
  };

  files : List_Note_File[];

  async ngOnInit() {
    this.files = await this.noteService.readFiles(this.data as string,()=> this.spinner.hide(SpinnerType.BallAtom));
  }

  async deleteFile(fileId: string, event: any) {
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: DeleteState.Yes,
      afterClosed: async () => {
        this.spinner.show(SpinnerType.BallAtom);
        const card = $(event.target).closest('.note-pdf-card');
        card.fadeOut(900, async () => {
          await this.noteService.deleteFile(this.data as string, fileId, () => {
            card.remove();
          this.spinner.hide(SpinnerType.BallAtom);
    });
  })
}
})
  }
}

export enum SelectNotePdfState {
  Close
}
