import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AskForRecoverPassword, RecoverPassword } from '../models/RecoverPassword';

@Injectable({
  providedIn: 'root'
})
export class RecoverPasswordService {
  private url = '/api/password/recover';

  constructor(private http: HttpClient) { }

  public ask = (email: AskForRecoverPassword): Observable<void> => {
    return this.http.post<void>(`${this.url}/ask`, email);
  }

  public recover = (newPassword: RecoverPassword): Observable<void> => {
    return this.http.post<void>(`${this.url}`, newPassword);
  }
}
