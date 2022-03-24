import { Component} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-match-offers-changes-detected-dialog',
  templateUrl: './match-offers-changes-detected-dialog.component.html',
  styleUrls: ['./match-offers-changes-detected-dialog.component.less']
})
export class MatchOffersChangesDetectedDialogComponent {

  public type: string;
  public name: string;

  constructor(public dialogRef: MatDialogRef<MatchOffersChangesDetectedDialogComponent>) {}

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }
}
