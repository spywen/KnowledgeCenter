import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { EnvironmentConfigurations } from '../../core/models/EnvironmentConfigurations';
import { LastTokens } from '../../core/models/LastTokens';
import { catchError } from 'rxjs/operators';

export const VERSION = 'version';

export function configurationLoaderFactory(service: ConfigurationsService) {
  return () => service.loadConfiguratons();
}

@Injectable({
  providedIn: 'root'
})
export class ConfigurationsService {
  private url = '/api/configurations';

  constructor(private http: HttpClient) { }

  public loadConfiguratons = (): Promise<boolean> => {
    let headers = new HttpHeaders();
    headers = headers.set('NOLOADER', '1');
    headers = headers.set('NODISPLAYERROR', '1');
    return new Promise((resolve) => {
        this.http
            .get<EnvironmentConfigurations>(`${this.url}/ping`, { headers })
            .pipe(catchError(() => {
              resolve(true);
              return throwError('Impossible to ping, probably internet connection issue.');
            }))
            .subscribe(configurations => {
              localStorage.setItem(VERSION, configurations.version);
              resolve(true);
            });
    });
  }

  public getVersion = (): string => {
    return localStorage.getItem(VERSION);
  }

  public resetVersion = (): void => {
    localStorage.removeItem(VERSION);
  }

  public ping = (isAsync: boolean): Observable<EnvironmentConfigurations> => {
    let headers = new HttpHeaders();
    if (isAsync) {
      headers = headers.set('NOLOADER', '1');
    }
    return this.http.get<EnvironmentConfigurations>(`${this.url}/ping`, { headers });
  }

  public sping = (): Observable<EnvironmentConfigurations> => {
    return this.http.get<EnvironmentConfigurations>(`${this.url}/sping`);
  }

  public initializeE2ETestingData = (): Observable<boolean> => {
    return this.http.post<boolean>(`${this.url}/e2e/init`, null);
  }

  public getLastTokens = (): Observable<LastTokens> => {
    return this.http.get<LastTokens>(`${this.url}/e2e/lasttokens`);
  }
}
