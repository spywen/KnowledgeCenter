import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateOrUpdatePublication } from '../models/CreateOrUpdatePublication';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BasePaginationRequest, BasePaginationResponse } from 'src/app/shared/models/BasePagination';
import { IPublication } from '../models/Publication';
import { Resolve } from '@angular/router';

export const DEFAULT_FLUX_PUBLICATIONS_PER_PAGE = 20;

@Injectable({
  providedIn: 'root'
})
export class FluxService {

  private url = '/api/flux/publication';

  constructor(private http: HttpClient) { }

  public create = (project: CreateOrUpdatePublication): Observable<IPublication> => {
    return this.http.post<IPublication>(`${this.url}`, project);
  }

  public update = (project: CreateOrUpdatePublication): Observable<IPublication> => {
    return this.http.put<IPublication>(`${this.url}`, project);
  }

  public delete = (id: number): Observable<any> => {
    return this.http.delete(`${this.url}/${id}`);
  }

  public likePublication = (id: number, likeCode: string): Observable<IPublication> => {
    let headers = new HttpHeaders();
    headers = headers.set('NOLOADER', '1');
    return this.http.patch<IPublication>(`${this.url}/${id}/like/${likeCode}`, null, { headers });
  }

  public getPublications = (query: BasePaginationRequest<void>): Observable<BasePaginationResponse<IPublication[]>> => {
    return this.http.post<BasePaginationResponse<IPublication[]>>(`${this.url}/all`, query);
  }
}

@Injectable()
export class PublicationResolver implements Resolve<BasePaginationResponse<IPublication[]>> {
  constructor(private fluxService: FluxService) {}
  resolve(): Observable<BasePaginationResponse<IPublication[]>> {
    const query = {
      page: 1,
      size: DEFAULT_FLUX_PUBLICATIONS_PER_PAGE
    } as BasePaginationRequest<void>;
    return this.fluxService.getPublications(query);
  }
}
