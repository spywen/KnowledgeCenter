import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SocketStatus } from '../models/SocketStatus';

@Injectable({
  providedIn: 'root'
})
export class StatusEventsService {
  private requestOnAir$: BehaviorSubject<boolean>;
  private routingOnAir$: BehaviorSubject<boolean>;
  private socketStatus$: BehaviorSubject<string>;
  private tokenRefreshed$: Subject<boolean>;
  private refreshTokenOperationInProgress$: BehaviorSubject<boolean>;
  private connectionStatus$: BehaviorSubject<boolean>;

  constructor() {
    this.requestOnAir$ = new BehaviorSubject(false);
    this.routingOnAir$ = new BehaviorSubject(false);
    this.socketStatus$ = new BehaviorSubject(SocketStatus.DISCONNECTED);
    this.tokenRefreshed$ = new Subject<boolean>();
    this.refreshTokenOperationInProgress$ = new BehaviorSubject(false);
    this.connectionStatus$ = new BehaviorSubject(true);
  }

  // ------------- HTTP -------------
  /**
   * Indicates if HTTP request is running
   * @param isOnAir true: if running, false: if not
   */
  setHttpStatus(isOnAir: boolean) {
    this.requestOnAir$.next(isOnAir);
  }

  /**
   * Indicates (if true) that HTTP request is running
   */
  getHttpStatus(): Observable<boolean> {
    return this.requestOnAir$.asObservable();
  }

  // ------------- ROUTING -------------
  /**
   * Indicates if routing naviguation is running
   * @param isOnAir true: if running, false: if not
   */
  setRoutingStatus(isOnAir: boolean) {
    this.routingOnAir$.next(isOnAir);
  }

  /**
   * Indicates (if true) that routing naviguation is running
   */
  getRoutingStatus(): Observable<boolean> {
    return this.routingOnAir$.asObservable();
  }

  // ------------- SOCKET -------------
  /**
   * Set sockets status
   * @param status socket status
   */
  setSocketStatus(status: SocketStatus) {
    if (status !== this.socketStatus$.value) {
      this.socketStatus$.next(status);
    }
  }

  /**
   * Indicates (if true) that sockets are running
   */
  getSocketsStatus(): Observable<string> {
    return this.socketStatus$.asObservable();
  }

  // ------------- REFRESH TOKENS OPERATION -------------

  /**
   * Start refresh token operation
   */
  startRefreshTokensOperation(): void {
    this.refreshTokenOperationInProgress$.next(true);
  }

  /**
   * Stop refresh token operation
   */
  stopRefreshTokensOperation(): void {
    this.refreshTokenOperationInProgress$.next(false);
    this.tokenRefreshed$.next(true);
  }

  /**
   * Observable which is indicating when refresh tokens have been updated
   */
  tokensRefreshed(): Observable<boolean> {
    return this.tokenRefreshed$.asObservable();
  }

  /**
   * Return status of refresh tokens operations
   * True: if in progress
   * False: if not in progress
   */
  isRefreshTokensOperationInProgress(): boolean {
    return this.refreshTokenOperationInProgress$.getValue();
  }

  // --------- NETWORK ACCESS ----------
  /**
   * Indicates if the browser has access to the network
   * @param hasAccessToNetwork true: if has access to network, false: if not
   */
  setConnectionStatus(hasAccessToNetwork: boolean) {
    this.connectionStatus$.next(hasAccessToNetwork);
  }

  /**
   * Indicates (if true) that the browser has access to the network
   */
  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus$.asObservable();
  }


}
