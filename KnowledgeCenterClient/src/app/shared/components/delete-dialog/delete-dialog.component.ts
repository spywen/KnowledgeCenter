import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';

export interface DeleteParameters {
  type: string;
  name: string;
  customTemplate: TemplateRef<any>;
  elementId: number;
  deleteAction: Observable<any>;
}

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.less']
})
export class DeleteDialogComponent {

  public type: string;
  public name: string;
  public customTemplate: TemplateRef<any>;

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DeleteParameters
  ) {
    this.type = data.type;
    this.name = data.name;
    this.customTemplate = data.customTemplate;
  }

  @ViewChild('deleteMessage', { static: true })
  public deleteMessageTemplate: TemplateRef<any>;

  onConfirmClick(): void {
    this.data.deleteAction.subscribe(() => {
      this.dialogRef.close(true);
    });
  }
}
