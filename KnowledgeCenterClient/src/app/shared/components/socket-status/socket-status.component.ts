import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SocketStatus } from '../../models/SocketStatus';
import { StatusEventsService } from '../../events/status-events-service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-socket-status',
  templateUrl: './socket-status.component.html',
  styleUrls: ['./socket-status.component.less']
})
export class SocketStatusComponent implements OnInit, OnDestroy {

  @Output() tryRestart = new EventEmitter();

  public SocketStatus = SocketStatus;
  public SocketActivity: SocketStatus;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private statusEventService: StatusEventsService) {
    this.statusEventService.getSocketsStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe((status: SocketStatus) => {
        this.SocketActivity = status;
      });
  }

  ngOnInit() {
  }

  public restart() {
    this.tryRestart.emit();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
