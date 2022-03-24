import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Agency } from '../models/Agency';
import { Resolve } from '@angular/router';

@Injectable()
export class AgencyService {

  private url = '/api/agency';

  constructor(private http: HttpClient) { }

  public getAll = (): Observable<Agency[]> => {
    return this.http.get<Agency[]>(`${this.url}`);
  }

  public get = (id: number): Observable<Agency> => {
    return this.http.get<Agency>(`${this.url}/${id}`);
  }

  public create = (agency: Agency): Observable<Agency> => {
    return this.http.post<Agency>(`${this.url}`, agency);
  }

  public update = (agency: Agency): Observable<Agency> => {
    return this.http.put<Agency>(`${this.url}/${agency.id}`, agency);
  }

  public delete = (id: number): Observable<any> => {
    return this.http.delete(`${this.url}/${id}`);
  }
}

@Injectable()
export class AgencyResolver implements Resolve<Agency[]> {
  constructor(private agencyService: AgencyService) {}
  resolve(): Observable<Agency[]> {
    return this.agencyService.getAll();
  }
}
