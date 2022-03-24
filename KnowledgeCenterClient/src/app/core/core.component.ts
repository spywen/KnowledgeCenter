import { Component, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { StatusEventsService } from '../shared/events/status-events-service';
import { Router, Event, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ScrollEventsService } from '../shared/events/scroll-events.service';
import { ConnectionState, ConnectionStateService } from '../shared/services/connection-state.service';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.less']
})
export class CoreComponent implements OnDestroy {

  public RoutingActivity: boolean;
  public HTTPActivity: boolean;
  public ConnectionStatus = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private statusEventService: StatusEventsService,
    private router: Router,
    private scrollEventsService: ScrollEventsService,
    private connectionStateService: ConnectionStateService) {

    // HTTP REQUEST LOADER
    this.statusEventService.getHttpStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isHttpRequestOnAir: boolean) => {
        this.HTTPActivity = isHttpRequestOnAir;
      });

    // ROUTING LOADER
    this.statusEventService.getRoutingStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe((isRoutingOnAir: boolean) => {
        this.RoutingActivity = isRoutingOnAir;
      });

    // NETWORK ACCESS STATUS LOADER
    this.statusEventService.getConnectionStatus()
      .pipe(takeUntil(this.destroy$))
      .subscribe((networkAccessStatus: boolean) => {
        this.ConnectionStatus = networkAccessStatus;
      });

    // NETWORK ACCESS STATUS SETTER
    this.connectionStateService.monitor().subscribe((connectionState: ConnectionState) => {
      if (!connectionState.hasInternetAccess || !connectionState.hasNetworkConnection) {
        this.statusEventService.setConnectionStatus(false);
      } else {
        this.statusEventService.setConnectionStatus(true);
      }
    });

    // ROUTING STATUS SETTER
    this.router.events
      .pipe(takeUntil(this.destroy$))
      .subscribe((event: Event) => {
        switch (true) {
          case event instanceof NavigationStart: {
            this.statusEventService.setRoutingStatus(true);
            break;
          }

          case event instanceof NavigationEnd:
          case event instanceof NavigationCancel:
          case event instanceof NavigationError: {
            this.statusEventService.setRoutingStatus(false);
            break;
          }
          default: {
            break;
          }
        }
      });
  }

  public onScrollDown() {
    this.scrollEventsService.scrollDown();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
