import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseDialog } from '../base/base-dialog';

// Dialogu açarken göndereceğimiz ayarlar
export interface FileUploadDialogData {
  title?: string;       // Örn: "Profil Resmi Yükle"
  multiple?: boolean;   // Çoklu seçim açık mı?
  accept?: string;      // Hangi dosya tipleri? Örn: ".pdf,.jpg"
}

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss']
})
export class FileUploadDialogComponent extends BaseDialog<FileUploadDialogComponent> {
  
  files: File[] = []; // Seçilen dosyalar burada tutulur
  isDragging: boolean = false; // Sürükleme efekti için

  constructor(
    dialogRef: MatDialogRef<FileUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileUploadDialogData
  ) {
    super(dialogRef);
    // Varsayılan ayarlar
    if (!this.data) this.data = {};
    if (this.data.multiple === undefined) this.data.multiple = true;
    if (!this.data.title) this.data.title = "Dosya Yükle";
    if (!this.data.accept) this.data.accept = "*/*";
  }

  // --- FILE SELECTION EVENTS ---

  onFileSelected(event: any) {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      this.processFiles(selectedFiles);
    }
  }

  // --- DRAG & DROP EVENTS ---

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.processFiles(event.dataTransfer.files);
    }
  }

  // --- HELPERS ---

  processFiles(fileList: FileList) {
    if (!this.data.multiple) {
      this.files = []; // Tekli seçimse eskisini sil
    }

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      // Duplicate kontrolü (Aynı dosyayı iki kere eklemesin)
      if (!this.files.some(f => f.name === file.name && f.size === file.size)) {
        this.files.push(file);
      }
    }
  }

  removeFile(index: number) {
    this.files.splice(index, 1);
  }

  // Bayt'ı okunabilir formata çevir (Örn: 1.5 MB)
  formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}

