import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BasePaginationRequest, BasePaginationResponse } from '../../shared/models/BasePagination';
import { Observable } from 'rxjs';
import { MatchingFilter } from '../models/MatchingFilter';
import { Matching } from '../models/Matching';

@Injectable({
  providedIn: 'root'
})
export class MatchingService {
  private url = '/api/match/matching';
  constructor(private http: HttpClient) { }

  public getAll = (query: BasePaginationRequest<MatchingFilter>, isAsync: boolean = false): Observable<BasePaginationResponse<Matching[]>> => {
    let headers = new HttpHeaders();
    if (isAsync) {
      headers = headers.set('NOLOADER', '1');
    }
    return this.http.post<BasePaginationResponse<Matching[]>>(`${this.url}`, query, { headers });
  }

  public generateResult = (customerOfferId: number): Observable<Matching[]> => {
    return this.http.get<Matching[]>(`${this.url}/${customerOfferId}/generate`);
  }
}
