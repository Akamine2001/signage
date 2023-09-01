import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-del-confirm-dialog',
  templateUrl: './del-confirm-dialog.component.html',
  styleUrls: ['./del-confirm-dialog.component.scss']
})
export class DelConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DelConfirmDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: string,
  ){}

  closeDialog(t:boolean) {
    this.dialogRef.close(t);
  }

}
