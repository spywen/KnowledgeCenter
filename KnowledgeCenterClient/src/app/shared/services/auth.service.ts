import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Credentials } from '../models/Credentials';
import { Tokens } from '../models/Tokens';

@Injectable()
export class AuthService {

  private url = '/api/auth';

  constructor(private http: HttpClient) { }

  public login = (credentials: Credentials): Observable<Tokens> => {
    return this.http.post<Tokens>(`${this.url}/login`, credentials);
  }

  public refreshTokens = (tokens: Tokens): Observable<Tokens> => {
    return this.http.post<Tokens>(`${this.url}/refresh`, tokens);
  }

  public logout = (): Observable<void> => {
    return this.http.post<void>(`${this.url}/logout`, null);
  }
}
