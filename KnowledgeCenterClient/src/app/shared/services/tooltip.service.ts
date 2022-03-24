import { Injectable, TemplateRef, Inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarParameters, SnackBarType } from '../models/SnackBar';
import { SnackbarTemplateComponent } from '../components/snackbar-template/snackbar-template.component';
import { Observable } from 'rxjs';

const POSITION_DEFAULT = 'right';

@Injectable({
  providedIn: 'root'
})
export class TooltipService {

  constructor(
    private snackBar: MatSnackBar,
    @Inject('SNACK_DEFAULT_DURATION') private snackBarDefaultDuration: number) { }

  public error(template: TemplateRef<any>, duration: number = this.snackBarDefaultDuration) {
    this.snackBar.openFromComponent(SnackbarTemplateComponent, {
      data: { template, type: SnackBarType.ERROR } as SnackBarParameters,
      duration,
      panelClass: ['snackbar', 'error'],
      horizontalPosition: POSITION_DEFAULT
    });
  }

  public warning(template: TemplateRef<any>, duration: number = this.snackBarDefaultDuration) {
    this.snackBar.openFromComponent(SnackbarTemplateComponent, {
      data: { template, type: SnackBarType.WARNING } as SnackBarParameters,
      duration,
      panelClass: ['snackbar', 'warning'],
      horizontalPosition: POSITION_DEFAULT
    });
  }

  public info(template: TemplateRef<any>, duration: number = this.snackBarDefaultDuration) {
    this.snackBar.openFromComponent(SnackbarTemplateComponent, {
      data: { template, type: SnackBarType.INFO } as SnackBarParameters,
      duration,
      panelClass: ['snackbar', 'info'],
      horizontalPosition: POSITION_DEFAULT
    });
  }

  public backEndError(message: string, duration: number = this.snackBarDefaultDuration) {
    this.snackBar.openFromComponent(SnackbarTemplateComponent, {
      data: { message, type: SnackBarType.ERROR } as SnackBarParameters,
      duration,
      panelClass: ['snackbar', 'error'],
      horizontalPosition: POSITION_DEFAULT
    });
  }

  public backEndWarning(message: string, duration: number = this.snackBarDefaultDuration) {
    this.snackBar.openFromComponent(SnackbarTemplateComponent, {
      data: { message, type: SnackBarType.WARNING } as SnackBarParameters,
      duration,
      panelClass: ['snackbar', 'warning'],
      horizontalPosition: POSITION_DEFAULT
    });
  }

  public backEndInfo(message: string, duration: number = this.snackBarDefaultDuration) {
    this.snackBar.openFromComponent(SnackbarTemplateComponent, {
      data: { message, type: SnackBarType.INFO } as SnackBarParameters,
      duration,
      panelClass: ['snackbar', 'info'],
      horizontalPosition: POSITION_DEFAULT
    });
  }

  public errorWithCallback(message: string, duration: number = this.snackBarDefaultDuration): Observable<any> {
    const snackbar = this.snackBar.openFromComponent(SnackbarTemplateComponent, {
      data: { message, type: SnackBarType.ERROR } as SnackBarParameters,
      duration,
      panelClass: ['snackbar', 'error'],
      horizontalPosition: POSITION_DEFAULT
    });

    return snackbar.afterDismissed();
  }

  public infoWithCallback(message: string, duration: number = this.snackBarDefaultDuration): Observable<any> {
    const snackbar = this.snackBar.openFromComponent(SnackbarTemplateComponent, {
      data: { message, type: SnackBarType.INFO } as SnackBarParameters,
      duration,
      panelClass: ['snackbar', 'info'],
      horizontalPosition: POSITION_DEFAULT
    });

    return snackbar.afterDismissed();
  }

  public customInfoWithCallback(parameters: SnackBarParameters, duration: number = 0) {
    const snackbar = this.snackBar.openFromComponent(SnackbarTemplateComponent, {
      data: parameters,
      duration,
      panelClass: ['snackbar', 'info'],
      horizontalPosition: POSITION_DEFAULT
    });

    return snackbar.afterDismissed();
  }

}
