import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material';
import { expectedNameValidator } from '../../../../shared/validators/expectedNameValidator';

@Component({
  selector: 'app-delete-user-dialog',
  templateUrl: './delete-user-dialog.component.html',
  styleUrls: ['./delete-user-dialog.component.scss']
})
export class DeleteUserDialogComponent implements OnInit {

  shouldBeDeleted = false;

  removeFromCourseForm: FormGroup;
  constructor(private fb: FormBuilder,
              private dialogRef: MatDialogRef<DeleteUserDialogComponent>){ }

  ngOnInit() {
    this.createRemoveFromCourseForm();
  }

  createRemoveFromCourseForm(){
    this.removeFromCourseForm = this.fb.group({
      'confirmation': ['', expectedNameValidator('usuń')]
    })
  }

  onCancelClick() {
    this.shouldBeDeleted = false;
    this.dialogRef.close();
  }

  onConfirmClick() {
    this.shouldBeDeleted = true;
    this.dialogRef.close()
  }

}
