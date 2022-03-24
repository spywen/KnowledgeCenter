import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Resolve } from '@angular/router';
import { BasePaginationRequest } from 'src/app/shared/models/BasePagination';
import { CovidStatsResponse } from '../models/CovidStats';
import { CovidStatsFilters } from '../models/CovidStatsFilters';

@Injectable()
export class CovidService {

  private url = '/api/covid';

  constructor(private http: HttpClient) { }

  public getStats = (filters: BasePaginationRequest<CovidStatsFilters>): Observable<CovidStatsResponse> => {
    return this.http.post<CovidStatsResponse>(`${this.url}/stats`, filters);
  }
}

@Injectable()
export class CovidStatsResolver implements Resolve<CovidStatsResponse> {
  constructor(private covidService: CovidService) {}
  resolve(): Observable<CovidStatsResponse> {
    return this.covidService.getStats({ filters: { countryCodes: [] }} as BasePaginationRequest<CovidStatsFilters>);
  }
}
