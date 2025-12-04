import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BaseDialog } from '../base/base-dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

export interface UpdateCommentDialogData {
  currentContent: string;
}

@Component({
  selector: 'app-update-comment-dialog',
  templateUrl: './update-comment-dialog.component.html',
  styleUrls: ['./update-comment-dialog.component.scss']
})
export class UpdateCommentDialogComponent extends BaseDialog<UpdateCommentDialogComponent> {

  updateForm!: FormGroup;

  constructor(
    dialogRef: MatDialogRef<UpdateCommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UpdateCommentDialogData,
    private formBuilder: FormBuilder
  ) {
    super(dialogRef);
    this.createForm();
  }

  createForm() {
    this.updateForm = this.formBuilder.group({
      content: [this.data?.currentContent || '', [Validators.required, Validators.maxLength(1000)]]
    });
  }

  get f() {
    return this.updateForm.controls;
  }

  onCancel() {
    this.dialogRef.close(null);
  }

  onUpdate() {
    if (this.updateForm.invalid) return;
    this.dialogRef.close(this.updateForm.value.content);
  }
}

