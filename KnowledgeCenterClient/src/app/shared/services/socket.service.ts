import { Injectable, Inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { TokenService } from './token.service';
import { StatusEventsService } from '../events/status-events-service';
import { SocketStatus } from '../models/SocketStatus';
import { TooltipService } from './tooltip.service';
import { HttpClient } from '@angular/common/http';

export const RetryConnectionDurationsSequence = [0, 5000, 15000];

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private connection: signalR.HubConnection;
  private channel: string;

  constructor(
    @Inject('STARTPOINT_API_URL') private startPointApiUrl: string,
    @Inject('ENVIRONMENT') private environment: string,
    @Inject('WEB_SOCKETS_ENABLED') private enableWebSockets: boolean,
    private tokenService: TokenService,
    private statusEventService: StatusEventsService,
    private tooltipService: TooltipService,
    private http: HttpClient) { }

  public start(channel: string): void {

    if (!this.enableWebSockets) {
      return;
    }

    this.channel = channel;
    this.connection = this.initializeConnection();

    this.tryToConnect();
  }

  public invoke(methodName: string, ...args: any[]): Promise<any> {
    if (!this.enableWebSockets) {
      return;
    }

    return this.connection.invoke(methodName, ...args);
  }

  public on(methodName: string, newMethod: (...args: any[]) => void): void {
    if (!this.enableWebSockets) {
      return;
    }

    return this.connection.on(methodName, newMethod);
  }

  public stop(): void {
    if (!this.enableWebSockets) {
      return;
    }

    this.connection.stop();
    this.statusEventService.setSocketStatus(SocketStatus.DISCONNECTED);
  }

  private initializeConnection(): signalR.HubConnection {
    this.statusEventService.setSocketStatus(SocketStatus.CONNECTING);

    const connectionBuilder = new signalR.HubConnectionBuilder()
      .withUrl(`${this.startPointApiUrl}/sockets/${this.channel}`, { accessTokenFactory: () => this.tokenService.getTokens().token })
      .withAutomaticReconnect(RetryConnectionDurationsSequence);

    this.enableLogging(connectionBuilder);
    const connection = connectionBuilder.build();

    /* Events */
    connection.onreconnecting(() => {
      this.statusEventService.setSocketStatus(SocketStatus.RECONNECTING);
    });
    connection.onreconnected(() => {
      this.statusEventService.setSocketStatus(SocketStatus.CONNECTED);
    });
    connection.onclose(() => {
      this.statusEventService.setSocketStatus(SocketStatus.DISCONNECTED);
    });

    return connection;
  }

  private tryToConnect() {
    this.http.get<any>(`/api/configurations/sping`).subscribe(() => {
      this.connection.start().then(() => {
        this.statusEventService.setSocketStatus(SocketStatus.CONNECTED);
      }).catch(() => {
        this.statusEventService.setSocketStatus(SocketStatus.DISCONNECTED);
        this.tooltipService.errorWithCallback('Live data flow cannot be reconnected ;(', 0).subscribe(() => {
          this.statusEventService.setSocketStatus(SocketStatus.RECONNECTING);
          this.tryToConnect();
        });
      });
    });
  }

  private enableLogging(connectionBuilder: signalR.HubConnectionBuilder) {
    if (this.environment === 'Development') {
      connectionBuilder.configureLogging(signalR.LogLevel.Trace);
    }
    return connectionBuilder;
  }
}
