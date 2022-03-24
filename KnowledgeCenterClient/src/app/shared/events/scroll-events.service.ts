import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ScrollEventsService {

  private globalScrollDown$: Subject<boolean>;

  constructor() {
    this.globalScrollDown$ = new Subject();
  }

  scrollDown() {
    this.globalScrollDown$.next();
  }

  listenScrollDown(): Observable<boolean> {
    return this.globalScrollDown$.asObservable();
  }
}
