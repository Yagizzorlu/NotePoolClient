import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseDialog } from '../base/base-dialog';

// Dışarıdan veri alırken kullanacağımız yapı
export interface DeleteDialogData {
  title?: string;   // Opsiyonel: Varsayılan "Silme İşlemi"
  message?: string; // Opsiyonel: Varsayılan "Bu kaydı silmek istediğinize emin misiniz?"
}

export enum DeleteState {
  Yes,
  No
}

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss']
})
export class DeleteDialogComponent extends BaseDialog<DeleteDialogComponent> {

  constructor(
    dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteDialogData | null // Veri null gelebilir, kontrol edeceğiz
  ) {
    super(dialogRef);
  }

  // Template'de Enum kullanmak için
  State = DeleteState;
}

