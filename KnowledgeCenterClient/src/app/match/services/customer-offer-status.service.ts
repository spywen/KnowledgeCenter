import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerOfferStatus } from '../models/CustomerOfferStatus';

@Injectable()
export class CustomerOfferStatusService {

  private url = '/api/match/customer-offer-status';
  constructor(private http: HttpClient) { }

  public getAll = (): Observable<CustomerOfferStatus[]> => {
    return this.http.get<CustomerOfferStatus[]>(`${this.url}`);
  }
}
