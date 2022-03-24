import { Inject, Injectable, Optional, LOCALE_ID } from '@angular/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { Moment } from 'moment';
import * as moment from 'moment';

@Injectable()
export class MomentUtcDateAdapter extends MomentDateAdapter {

  constructor(@Optional() @Inject(LOCALE_ID) public locale: string) {
    super(locale);
  }

  createDate(year: number, month: number, date: number): Moment {
    return moment([year, month, date]);
  }
}
