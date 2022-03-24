import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CustomerOffer } from '../models/CustomerOffer';
import { BasePaginationRequest, BasePaginationResponse } from '../../shared/models/BasePagination';
import { CustomerOfferFilter } from '../models/CustomerOfferFilter';
import { forkJoin, Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { ServiceLineService } from '../../shared/services/service-line.service';
import { AgencyService } from '../../shared/services/agency.service';
import { SkillService } from './skill.service';
import { SkillLevelService } from './skill-level.service';
import { CustomerOfferStatusService } from './customer-offer-status.service';
import { CustomerOfferSkill } from '../models/CustomerOfferSkill';
import { CustomersService } from './customers.service';
import { CustomerFilter } from '../models/CustomerFilter';

export const DEFAULT_OFFER_PER_PAGE = 20;

@Injectable()
export class OfferService {
  private url = '/api/match/customer-offer';
  constructor(private http: HttpClient) { }

  public getAll = (query: BasePaginationRequest<CustomerOfferFilter>): Observable<BasePaginationResponse<CustomerOffer[]>> => {
    return this.http.post<BasePaginationResponse<CustomerOffer[]>>(`${this.url}`, query);
  }

  public get = (offerId: number, isAsync: boolean = false): Observable<CustomerOffer> => {
    let headers = new HttpHeaders();
    if (isAsync) {
      headers = headers.set('NOLOADER', '1');
    }
    return this.http.get<CustomerOffer>(`${this.url}/${offerId}`, { headers });
  }

  public getRequiredSkills = (offerId: number, isAsync: boolean = false): Observable<CustomerOfferSkill[]> => {
    let headers = new HttpHeaders();
    if (isAsync) {
      headers = headers.set('NOLOADER', '1');
    }
    return this.http.get<CustomerOfferSkill[]>(`${this.url}/${offerId}/skills`, { headers });
  }

  public createCustomerOffer = (customerOffer: CustomerOffer): Observable<CustomerOffer> => {
    return this.http.post<CustomerOffer>(`${this.url}/create`, customerOffer);
  }

  public updateCustomerOffer = (customerOfferId: number, customerOffer: CustomerOffer): Observable<CustomerOffer> => {
    return this.http.put<CustomerOffer>(`${this.url}/${customerOfferId}`, customerOffer);
  }

  public deleteCustomerOffer = (customerOfferId: number) => {
    return this.http.delete(`${this.url}/${customerOfferId}`);
  }

  public updateRequiredSkills = (offerId: number, newSkills: CustomerOfferSkill[]): Observable<CustomerOfferSkill[]> => {
    return this.http.put<CustomerOfferSkill[]>(`${this.url}/${offerId}/skills`, newSkills);
  }

  public updateCustomerOfferSkillLevel = (customerOfferId: number, skillToModifyId: number, skillToModify: CustomerOfferSkill): Observable<CustomerOfferSkill> => {
    return this.http.put<CustomerOfferSkill>(`${this.url}/${customerOfferId}/skills/${skillToModifyId}`, skillToModify);
  }

  public deleteCustomerOfferSkill = (customerOfferId: number, skillToDeleteId: number) => {
    return this.http.delete(`${this.url}/${customerOfferId}/skills/${skillToDeleteId}`);
  }

  public addCustomerOfferSkill = (customerOfferId: number, skillToAdd: CustomerOfferSkill): Observable<CustomerOfferSkill> => {
    return this.http.post<CustomerOfferSkill>(`${this.url}/${customerOfferId}/skills`, skillToAdd);
  }
}


@Injectable()
export class CustomerOfferResolver implements Resolve<any[]> {

  constructor(
    private offersService: OfferService,
    private agencyService: AgencyService,
    private serviceLineService: ServiceLineService,
    private skillService: SkillService,
    private skillLevelService: SkillLevelService,
    private customerOfferStatusService: CustomerOfferStatusService,
    private customersService: CustomersService
  ) {  }

  resolve(): Observable<any[]> {
    const customerOffersResponse = this.offersService.getAll({
        page: 1,
        size: DEFAULT_OFFER_PER_PAGE
      } as BasePaginationRequest<CustomerOfferFilter>
    );
    const agenciesResponse = this.agencyService.getAll();
    const serviceLinesResponse = this.serviceLineService.getAll();
    const skillServiceResponse = this.skillService.getAll();
    const skillLevelServiceResponse = this.skillLevelService.getAll();
    const statusResponse = this.customerOfferStatusService.getAll();
    const customersResponse = this.customersService.getAll({} as BasePaginationRequest<CustomerFilter>);

    return forkJoin([
      customerOffersResponse,
      agenciesResponse,
      serviceLinesResponse,
      skillServiceResponse,
      skillLevelServiceResponse,
      statusResponse,
      customersResponse
    ]);
  }
}

