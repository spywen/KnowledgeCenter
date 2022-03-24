import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { Customer } from '../models/Customer';
import { HttpClient } from '@angular/common/http';
import { BasePaginationRequest, BasePaginationResponse } from '../../shared/models/BasePagination';
import { CustomerFilter } from '../models/CustomerFilter';

export const DEFAULT_CUSTOMER_PER_PAGE = 0; // Charge all customers

@Injectable()
export class CustomersService {

  private url = '/api/match/customer';

  constructor(private http: HttpClient) { }

  public getAll = (query: BasePaginationRequest<CustomerFilter>): Observable<BasePaginationResponse<Customer[]>> => {
    return this.http.post<BasePaginationResponse<Customer[]>>(`${this.url}`, query);
  }

  public get = (id: number): Observable<Customer> => {
    return this.http.get<Customer>(`${this.url}/${id}`);
  }

  public create = (customer: Customer): Observable<any> => {
    return this.http.post(`${this.url}/create`, customer);
  }

  public update = (customer: Customer): Observable<any> => {
    return this.http.put(`${this.url}/${customer.id}`, customer);
  }

  public delete = (id: number): Observable<any> => {
    return this.http.delete(`${this.url}/${id}`);
  }
}


@Injectable()
export class CustomersResolver implements Resolve<BasePaginationResponse<Customer[]>> {
  constructor(private customersService: CustomersService) {}

  resolve(): Observable<BasePaginationResponse<Customer[]>> {
    return this.customersService.getAll({
      page: 1,
      size: DEFAULT_CUSTOMER_PER_PAGE
    } as BasePaginationRequest<CustomerFilter>);
  }
}
