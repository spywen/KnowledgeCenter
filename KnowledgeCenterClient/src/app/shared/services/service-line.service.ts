import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceLine } from '../models/ServiceLine';
import { Resolve } from '@angular/router';

@Injectable()
export class ServiceLineService {

  private url = '/api/serviceline';

  constructor(private http: HttpClient) { }

  public getAll = (): Observable<ServiceLine[]> => {
    return this.http.get<ServiceLine[]>(`${this.url}`);
  }

  public get = (id: number): Observable<ServiceLine> => {
    return this.http.get<ServiceLine>(`${this.url}/${id}`);
  }

  public create = (serviceLine: ServiceLine): Observable<any> => {
    return this.http.post(`${this.url}`, serviceLine);
  }

  public update = (serviceLine: ServiceLine): Observable<any> => {
    return this.http.put(`${this.url}/${serviceLine.id}`, serviceLine);
  }

  public delete = (id: number): Observable<any> => {
    return this.http.delete(`${this.url}/${id}`);
  }
}

@Injectable()
export class ServiceLineResolver implements Resolve<ServiceLine[]> {
  constructor(private serviceLineService: ServiceLineService) {}
  resolve(): Observable<ServiceLine[]> {
    return this.serviceLineService.getAll();
  }
}
