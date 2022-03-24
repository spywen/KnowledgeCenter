import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BasePaginationRequest, BasePaginationResponse } from '../../shared/models/BasePagination';
import { Observable } from 'rxjs';
import { CustomerSite } from '../models/CustomerSite';
import { CustomerSiteFilter } from '../models/CustomerSiteFilter';

export const DEFAULT_CUSTOMER_SITE_PER_PAGE = 0; // Charge all customers sites

@Injectable({
  providedIn: 'root'
})
export class CustomerSiteService {

  private url = '/api/match/customer-site';

  constructor(private http: HttpClient) { }

  public getAll = (query: BasePaginationRequest<CustomerSiteFilter>, isAsync: boolean = false): Observable<BasePaginationResponse<CustomerSite[]>> => {
    let headers = new HttpHeaders();
    if (isAsync) {
      headers = headers.set('NOLOADER', '1');
    }
    return this.http.post<BasePaginationResponse<CustomerSite[]>>(`${this.url}`, query, { headers });
  }

  public get = (id: number): Observable<CustomerSite> => {
    return this.http.get<CustomerSite>(`${this.url}/${id}`);
  }

  public create = (customerSite: CustomerSite): Observable<any> => {
    return this.http.post(`${this.url}/create`, customerSite);
  }

  public update = (customerSite: CustomerSite): Observable<any> => {
    return this.http.put(`${this.url}/${customerSite.id}`, customerSite);
  }

  public delete = (id: number): Observable<any> => {
    return this.http.delete(`${this.url}/${id}`);
  }
}
