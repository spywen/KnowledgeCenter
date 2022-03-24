import { TemplateRef } from '@angular/core';

export interface SnackBarParameters {
  type: SnackBarType;
  template: TemplateRef<any>;
  message: string;
  dismissButtonText: string;
  actionButtonText: string;
}

export enum SnackBarType {
  ERROR,
  WARNING,
  INFO,
  INSTALL,
  UPDATE
}
