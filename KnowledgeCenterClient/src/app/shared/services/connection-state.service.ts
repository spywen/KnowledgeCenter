import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {fromEvent, Observable, Subscription, timer} from 'rxjs';
import {debounceTime, delay, retryWhen, startWith, switchMap, tap} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';

/**
 * Instance of this interface is used to report current connection status.
 */
export interface ConnectionState {
  /**
   * "True" if browser has network connection. Determined by Window objects "online" / "offline" events.
   */
  hasNetworkConnection: boolean;
  /**
   * "True" if browser has Internet access. Determined by heartbeat system which periodically makes request to heartbeat Url.
   */
  hasInternetAccess: boolean;
}

/**
 * Instance of this interface could be used to configure "ConnectionService".
 */
export interface ConnectionServiceOptions {
  /**
   * Controls the Internet connectivity heartbeat system. Default value is 'true'.
   */
  enableHeartbeat?: boolean;
  /**
   * Url used for checking Internet connectivity, heartbeat system periodically makes "HEAD" requests to this URL to determine Internet
   * connection status. Default value is "//internethealthtest.org".
   */
  heartbeatUrl?: string;
  /**
   * Interval used to check Internet connectivity specified in milliseconds. Default value is "30000".
   */
  heartbeatInterval?: number;
  /**
   * Interval used to retry Internet connectivity checks when an error is detected (when no Internet connection). Default value is "1000".
   */
  heartbeatRetryInterval?: number;
  /**
   * HTTP method used for requesting heartbeat Url. Default is 'head'.
   */
  requestMethod?: 'get' | 'post' | 'head' | 'options';

}

@Injectable({
  providedIn: 'root'
})
export class ConnectionStateService implements OnDestroy {
  private DEFAULT_OPTIONS: ConnectionServiceOptions = {
    enableHeartbeat: true,
    heartbeatUrl: '/assets/test-connection-state.json',
    heartbeatInterval: 30000,
    heartbeatRetryInterval: 2000,
    requestMethod: 'head'
  };

  private stateChangeEventEmitter = new EventEmitter<ConnectionState>();

  private currentState: ConnectionState = {
    hasInternetAccess: true,
    hasNetworkConnection: window.navigator.onLine
  };
  private offlineSubscription: Subscription;
  private onlineSubscription: Subscription;
  private httpSubscription: Subscription;
  private serviceOptions: ConnectionServiceOptions;

  constructor(private http: HttpClient) {
    this.serviceOptions = this.DEFAULT_OPTIONS;

    this.checkNetworkState();
    this.checkInternetState();
  }

  private checkInternetState() {

    if (this.httpSubscription) {
      this.httpSubscription.unsubscribe();
    }

    if (this.serviceOptions.enableHeartbeat) {
      let headers = new HttpHeaders();
      headers = headers.set('NOLOADER', '1');
      headers = headers.set('NODISPLAYERROR', '1');
      this.httpSubscription = timer(0, this.serviceOptions.heartbeatInterval)
        .pipe(
          switchMap(() => this.http[this.serviceOptions.requestMethod](this.serviceOptions.heartbeatUrl, {responseType: 'text', headers})),
          retryWhen(errors =>
            errors.pipe(
              // log error message
              tap(val => {
                this.currentState.hasInternetAccess = false;
                this.emitEvent();
              }),
              // restart after 5 seconds
              delay(this.serviceOptions.heartbeatRetryInterval)
            )
          )
        )
        .subscribe(result => {
          this.currentState.hasInternetAccess = true;
          this.emitEvent();
        });
    } else {
      this.currentState.hasInternetAccess = false;
      this.emitEvent();
    }
  }

  private checkNetworkState() {
    this.onlineSubscription = fromEvent(window, 'online').subscribe(() => {
      this.currentState.hasNetworkConnection = true;
      this.checkInternetState();
      this.emitEvent();
    });

    this.offlineSubscription = fromEvent(window, 'offline').subscribe(() => {
      this.currentState.hasNetworkConnection = false;
      this.checkInternetState();
      this.emitEvent();
    });
  }

  private emitEvent() {
    this.stateChangeEventEmitter.emit(this.currentState);
  }

  ngOnDestroy(): void {
    try {
      this.offlineSubscription.unsubscribe();
      this.onlineSubscription.unsubscribe();
      this.httpSubscription.unsubscribe();
    } catch (e) {
    }
  }

  /**
   * Monitor Network & Internet connection status by subscribing to this observer. If you set "reportCurrentState" to "false" then
   * function will not report current status of the connections when initially subscribed.
   * @param reportCurrentState Report current state when initial subscription. Default is "true"
   */
  monitor(reportCurrentState = true): Observable<ConnectionState> {
    return reportCurrentState ?
      this.stateChangeEventEmitter.pipe(
        debounceTime(300),
        startWith(this.currentState),
      )
      :
      this.stateChangeEventEmitter.pipe(
        debounceTime(300)
      );
  }
}
