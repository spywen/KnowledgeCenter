import { Injectable, Inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, finalize, switchMap } from 'rxjs/operators';
import { TokenService } from './token.service';
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { Credentials } from '../models/Credentials';
import { TryReconnectDialogComponent } from '../components/reconnect/try-reconnect-dialog.component';
import { Router } from '@angular/router';
import { StatusEventsService } from '../events/status-events-service';
import { TooltipService } from './tooltip.service';
import { AuthService } from './auth.service';
import { Tokens } from '../models/Tokens';
import { ConfigurationsService } from 'src/app/shared/services/configurations.service';

const RefreshTokenUrl = 'auth/refresh';

@Injectable({
  providedIn: 'root'
})
export class HttpListenerService implements HttpInterceptor {

  constructor(private dialog: MatDialog,
              private statusEventService: StatusEventsService,
              private tokenService: TokenService,
              private router: Router,
              private tooltipService: TooltipService,
              private authService: AuthService,
              private configuratonService: ConfigurationsService,
              @Inject('STARTPOINT_API_URL') private startPointApiUrl: string) { }

  public intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.startPointApiUrl) {
      request = request.clone({ url: this.startPointApiUrl + request.url });
    }

    this.toggleLoader(request.headers, true);
    request = this.addAuthHeader(request);

    return this.handleRequest(request, next);
  }

  private handleRequest(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const currentRoute = this.router.url;
    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => this.extractData(event)),
      catchError((errorResponse: HttpErrorResponse) => {
        if (errorResponse.status === 401 && !!errorResponse.headers.get('Token-Expired')) { // Authentification issue (token expired) -> ...
          // try to reconnect thanks to refresh token ...
          return this.authService.refreshTokens(this.tokenService.getTokens()).pipe(
            switchMap((result: Tokens) => {
              this.tokenService.setTokens(result);
              return next.handle(this.addAuthHeader(request)).pipe(
                map((event: HttpEvent<any>) => {
                  return this.extractData(event);
                }),
                catchError(() => throwError(errorResponse))
              );
            }),
            catchError(() => { // If refresh token is invalid or expired -> try to reconnect thanks reconnect popup by asking user to provide password
              this.toggleLoader(request.headers, false);
              this.forceClearRoutingLoader(); // Let's be sure that if user was trying to naviguate on another page -> routing loader will not be displayed
              return this.showReconnectDialog().pipe(
                switchMap(() => next.handle(this.addAuthHeader(request)).pipe(
                  map((event: HttpEvent<any>) => {
                    // Here trick... Not proud of this but really complex issue to manage. Please find some explanations below.
                    // The problem was: you are on the portal since a long time without doing anything and your tokens (both) are expired.
                    // You are trying to change of page which required a resolve (API call to load page) ->
                    // Because your both tokens are expired you will come here after user provided his password.
                    // At this time the angular routing seems to have been kind of cancelled.
                    // Let's force naviguation thanks to below code to the expected page !
                    if (this.router.getCurrentNavigation() && currentRoute !== this.router.getCurrentNavigation().extractedUrl.toString()) {
                      this.router.navigate([this.router.getCurrentNavigation().extractedUrl.toString()]);
                    }
                    return this.extractData(event);
                  })
                )));
            }));
        } else { // API error. Let's try to extract error message or display default error message

          // Do not warn user if error is coming from invalid refresh token
          if (errorResponse.url.includes(RefreshTokenUrl)) {
            return throwError(errorResponse);
          }

          if (!request.headers.has('NODISPLAYERROR')) {
            try {
              const jsonResponse = this.getResponseAsJson(errorResponse.error);
              if ('warnings' in jsonResponse && jsonResponse.warnings.length > 0) {
                this.tooltipService.backEndWarning(jsonResponse.warnings[0].description);
              } else if ('errors' in jsonResponse && jsonResponse.errors.length > 0) {
                this.tooltipService.backEndError(jsonResponse.errors[0].description);
              } else {
                throw false;
              }
            } catch (e) {
              this.tooltipService.backEndError('Unexpected client error occured. If problem persists please contact Administrator.');
            }
          }
          return throwError(errorResponse);
        }
      }),
      finalize(() => {
        this.toggleLoader(request.headers, false);
      }));
  }

  private extractData(event: HttpEvent<any>): HttpEvent<any> {
    if (event instanceof HttpResponse) {
      const jsonResponse = this.getResponseAsJson(event.body);
      let data: string = null;
      if (!!jsonResponse) {
        this.verifyVersion(jsonResponse);
        data = jsonResponse.data;
      }
      const modifiedEvent = event.clone({ body: data });
      return modifiedEvent;
    }
    return event;
  }

  private verifyVersion(jsonResponse: any) {
    if (!!jsonResponse.version && !!this.configuratonService.getVersion()) {
      const newVersion = jsonResponse.version.split('.');
      const currentVersion = this.configuratonService.getVersion().split('.');

      if (newVersion[0] > currentVersion[0] || newVersion[1] > currentVersion[1]) { // MAJOR / MINOR ONLY
        // PWA is doing the job now. Nothing to do here for now.
      }
    }
  }


  private addAuthHeader = (request: HttpRequest<any>): HttpRequest<any> => {
    const tokens = this.tokenService.getTokens();
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${tokens.token}`
      }
    });
    return request;
  }

  private toggleLoader = (headers: HttpHeaders, shouldActive: boolean) => {
    if (!headers.has('NOLOADER')) {
      this.statusEventService.setHttpStatus(shouldActive);
    }
  }

  private forceClearRoutingLoader() {
    this.statusEventService.setRoutingStatus(false);
  }

  private showReconnectDialog(): Observable<boolean> {
    if (!this.statusEventService.isRefreshTokensOperationInProgress()) {
      this.statusEventService.startRefreshTokensOperation();
      return new Observable<boolean>((observer) => {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.disableClose = true;
        dialogConfig.backdropClass = 'dark-backdrop';
        dialogConfig.width = '600px';
        dialogConfig.data = {
          login: this.tokenService.getTokenProfile().login
        } as Credentials;

        const dialogRef = this.dialog.open(TryReconnectDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe((isStaySuccess: boolean) => {
          if (isStaySuccess) {
            this.statusEventService.stopRefreshTokensOperation();
            observer.next(true);
          } else {
            this.tokenService.removeTokens();
            this.router.navigate(['/']);
            observer.error(false);
          }
        });
      });
    } else { // Wait tokens to be refreshed thanks to the previous request before continuing current request without have to open reconnect popup...
      return new Observable<boolean>((observer) => {
        this.statusEventService.tokensRefreshed().subscribe(() => {
          observer.next(true);
        });
      });
    }
  }

  private getResponseAsJson(responseBody: any): any {
    let jsonResponse = responseBody;
    if (!responseBody) {
      return null;
    }
    if (typeof responseBody === 'string') {
      jsonResponse = JSON.parse(responseBody);
    }
    return jsonResponse;
  }

}
