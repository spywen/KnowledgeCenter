import { TestBed } from '@angular/core/testing';
import { TooltipService } from './tooltip.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarType } from '../models/SnackBar';
import { TemplateRef } from '@angular/core';

describe('TooltipService', () => {
  let service: TooltipService;

  const template: TemplateRef<any> = undefined;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TooltipService,
      { provide: MatSnackBar, useValue: { openFromComponent: () => {}} },
      { provide: 'SNACK_DEFAULT_DURATION', useValue: 10000 }
    ]
  }));

  beforeEach(() => {
    service = TestBed.get(TooltipService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return error tooltip when call error method', () => {
    const matSnackBarSpy = spyOn(TestBed.get(MatSnackBar), 'openFromComponent');

    service.error(template);

    expect(matSnackBarSpy).toHaveBeenCalledWith(jasmine.any(Function), jasmine.objectContaining({
      data: { template, type: SnackBarType.ERROR },
      duration: 10000,
      panelClass: ['snackbar', 'error'],
      horizontalPosition: 'right'
    }));
  });

  it('should return warning tooltip when call warning method', () => {
    const matSnackBarSpy = spyOn(TestBed.get(MatSnackBar), 'openFromComponent');

    service.warning(template);

    expect(matSnackBarSpy).toHaveBeenCalledWith(jasmine.any(Function), jasmine.objectContaining({
      data: { template, type: SnackBarType.WARNING },
      duration: 10000,
      panelClass: ['snackbar', 'warning'],
      horizontalPosition: 'right'
    }));
  });

  it('should return info tooltip when call info method', () => {
    const matSnackBarSpy = spyOn(TestBed.get(MatSnackBar), 'openFromComponent');

    service.info(template);

    expect(matSnackBarSpy).toHaveBeenCalledWith(jasmine.any(Function), jasmine.objectContaining({
      data: { template, type: SnackBarType.INFO },
      duration: 10000,
      panelClass: ['snackbar', 'info'],
      horizontalPosition: 'right'
    }));
  });

  it('should return error tooltip when call backEndError method', () => {
    const matSnackBarSpy = spyOn(TestBed.get(MatSnackBar), 'openFromComponent');
    const message = 'MESSAGE';

    service.backEndError(message);

    expect(matSnackBarSpy).toHaveBeenCalledWith(jasmine.any(Function), jasmine.objectContaining({
      data: { message, type: SnackBarType.ERROR },
      duration: 10000,
      panelClass: ['snackbar', 'error'],
      horizontalPosition: 'right'
    }));
  });

  it('should return error tooltip when call backEndWarning method', () => {
    const matSnackBarSpy = spyOn(TestBed.get(MatSnackBar), 'openFromComponent');
    const message = 'MESSAGE';

    service.backEndWarning(message);

    expect(matSnackBarSpy).toHaveBeenCalledWith(jasmine.any(Function), jasmine.objectContaining({
      data: { message, type: SnackBarType.WARNING },
      duration: 10000,
      panelClass: ['snackbar', 'warning'],
      horizontalPosition: 'right'
    }));
  });

  it('should return error tooltip when call backEndInfo method', () => {
    const matSnackBarSpy = spyOn(TestBed.get(MatSnackBar), 'openFromComponent');
    const message = 'MESSAGE';

    service.backEndInfo(message);

    expect(matSnackBarSpy).toHaveBeenCalledWith(jasmine.any(Function), jasmine.objectContaining({
      data: { message, type: SnackBarType.INFO },
      duration: 10000,
      panelClass: ['snackbar', 'info'],
      horizontalPosition: 'right'
    }));
  });

});
