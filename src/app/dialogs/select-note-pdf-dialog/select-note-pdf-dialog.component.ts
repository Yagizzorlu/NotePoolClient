import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BaseDialog } from '../base/base-dialog';
import { DeleteDialogComponent, DeleteState } from '../delete-dialog/delete-dialog.component';
import { trigger, transition, style, animate } from '@angular/animations'; // Angular Animation
import { NoteFileDto } from '../../contracts/note-file-dto';
import { NoteService } from '../../services/common/models/note.service';
import { FileUploadService } from '../../services/common/models/file-upload.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/custom-toastr.service';
import { DialogService } from '../../services/common/dialog.service';

// State Enum
export enum SelectNotePdfState {
  Close
}

@Component({
  selector: 'app-select-note-pdf-dialog',
  templateUrl: './select-note-pdf-dialog.component.html',
  styleUrls: ['./select-note-pdf-dialog.component.scss'],
  // Liste elemanı silinirken yumuşak geçiş efekti
  animations: [
    trigger('fadeSlideInOut', [
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateX(20px)', opacity: 0 }))
      ])
    ])
  ]
})
export class SelectNotePdfDialogComponent extends BaseDialog<SelectNotePdfDialogComponent> implements OnInit {

  files: NoteFileDto[] = [];
  isLoading = true;

  constructor(
    dialogRef: MatDialogRef<SelectNotePdfDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string, // NoteId string olarak geliyor
    private noteService: NoteService,
    private fileUploadService: FileUploadService,
    private dialogService: DialogService,
    private toastr: CustomToastrService
  ) {
    super(dialogRef);
  }

  async ngOnInit() {
    await this.loadFiles();
  }

  async loadFiles() {
    this.isLoading = true;
    try {
      // NoteService içindeki readFiles metodu backend'deki 'GetNoteDetails' 
      // veya 'GetAllNotePdfFiles' endpoint'ine gitmeli.
      // Backend refactoring'de 'GetNoteDetails' içinde dosya listesi dönmüştük.
      // Burada sadece dosyaları çeken bir metodun olduğunu varsayıyoruz.
      this.files = await this.noteService.getNoteFiles(this.data); 
    } catch (error) {
      this.toastr.message("Dosyalar yüklenemedi", "Hata", { messageType: ToastrMessageType.Error, position: ToastrPosition.BottomRight });
    } finally {
      this.isLoading = false;
    }
  }

  deleteFile(fileId: string) {
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: { 
        title: "Dosyayı Sil", 
        message: "Bu PDF dosyasını kalıcı olarak silmek istediğinize emin misiniz?" 
      },
      afterClosed: async () => {
        // Dialog "Evet" dediğinde burası çalışır
        this.isLoading = true;
        try {
          await this.noteService.deleteFile(this.data, fileId);
          
          // REACTIVE UPDATE: jQuery ile silmek yerine array'i filtreliyoruz.
          // Angular değişikliği algılayıp animasyonla listeden çıkaracak.
          this.files = this.files.filter(f => f.id !== fileId);
          
          this.toastr.message("Dosya silindi", "Başarılı", { messageType: ToastrMessageType.Success, position: ToastrPosition.BottomRight });
        } catch (error) {
          this.toastr.message("Silme işlemi başarısız", "Hata", { messageType: ToastrMessageType.Error, position: ToastrPosition.BottomRight });
        } finally {
          this.isLoading = false;
        }
      }
    });
  }
  
  // Dosya seçildiğinde yükleme işlemini başlat
  async onFilesSelected(files: File[]) {
    if (!files || files.length === 0) return;

    this.isLoading = true;
    try {
      const response = await this.fileUploadService.uploadNoteFiles(this.data, files);
      
      if (response.isSuccess) {
        this.toastr.message("Dosyalar yüklendi", "Başarılı", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.BottomRight
        });
        
        // Yüklenen dosyaları listeye ekle
        if (response.uploadedFiles && response.uploadedFiles.length > 0) {
          this.files = [...this.files, ...response.uploadedFiles];
        } else {
          // Liste yenile
          await this.loadFiles();
        }
      } else {
        this.toastr.message(response.message || "Dosya yükleme başarısız", "Hata", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.BottomRight
        });
      }
    } catch (error) {
      this.toastr.message("Dosya yükleme başarısız", "Hata", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.BottomRight
      });
    } finally {
      this.isLoading = false;
    }
  }
}
