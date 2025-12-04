import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  // --- INPUTS ---
  @Input() accept: string = "*/*"; // Hangi dosyalar? (.pdf, .jpg)
  @Input() multiple: boolean = true; // Çoklu seçim?
  @Input() explanation: string = "Dosyaları buraya sürükleyin veya seçin."; 

  // --- OUTPUTS ---
  // Component dosyaları kendi yüklemez, seçilen dosyaları dışarı verir.
  // Parent component (Örn: NoteUpload) bu dosyaları alıp servise gönderir.
  @Output() filesSelected: EventEmitter<File[]> = new EventEmitter<File[]>();

  public files: File[] = [];

  constructor(private toastr: CustomToastrService) {}

  isImage(fileName: string): boolean {
    return !!fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i); // 'i' flag: Case insensitive
  }

  isPdf(fileName: string): boolean {
    return fileName.toLowerCase().endsWith('.pdf');
  }

  public dropped(files: NgxFileDropEntry[]) {
    for (const droppedFile of files) {
      // Klasör mü dosya mı kontrolü
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          this.addFile(file);
        });
      } else {
        // Klasörleri kabul etmiyoruz
        const fileEntry = droppedFile.fileEntry as FileSystemDirectoryEntry;
        console.log(droppedFile.relativePath, fileEntry);
      }
    }
  }

  public fileOver(event: any){
    // Hover efekti için (CSS ile halledilebilir ama event lazım olabilir)
    // console.log(event);
  }

  public fileLeave(event: any){
    // console.log(event);
  }

  // Dosya seçme butonundan gelenler
  public onFileSelect(event: any) {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      for (let i = 0; i < selectedFiles.length; i++) {
        this.addFile(selectedFiles[i]);
      }
    }
  }

  private addFile(file: File) {
    // 1. Duplicate Kontrolü
    if (this.files.some(f => f.name === file.name && f.size === file.size)) {
      return; 
    }

    // 2. Uzantı Kontrolü (Basit regex)
    // Accept "*.pdf" ise sadece pdf al
    if (this.accept !== "*/*" && !this.accept.includes("." + file.name.split('.').pop()?.toLowerCase())) {
       this.toastr.message("Geçersiz dosya formatı.", "Hata", { messageType: ToastrMessageType.Error, position: ToastrPosition.BottomRight });
       return;
    }

    // 3. Tekli/Çoklu Kontrolü
    if (!this.multiple) {
      this.files = [file];
    } else {
      this.files.push(file);
    }

    // Dışarıya haber ver
    this.filesSelected.emit(this.files);
  }

  public removeFile(index: number) {
    this.files.splice(index, 1);
    this.filesSelected.emit(this.files);
  }

  // Helper: Boyut formatlama
  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}
