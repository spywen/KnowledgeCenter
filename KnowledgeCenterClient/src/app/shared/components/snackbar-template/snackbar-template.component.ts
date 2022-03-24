import { Component, Inject } from '@angular/core';
import { SnackBarParameters, SnackBarType } from '../../models/SnackBar';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar-template',
  templateUrl: './snackbar-template.component.html',
  styleUrls: ['./snackbar-template.component.less']
})
export class SnackbarTemplateComponent {

  public snackBarType = SnackBarType;

  constructor(
    public snackBarRef: MatSnackBarRef<SnackbarTemplateComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public params: SnackBarParameters) { }

}
