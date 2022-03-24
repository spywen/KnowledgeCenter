import { TestBed } from '@angular/core/testing';
import { CustomerSiteService } from './customer-site.service';
import { BasePaginationRequest, BasePaginationResponse } from '../../shared/models/BasePagination';
import { Customer } from '../models/Customer';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomerSiteFilter } from '../models/CustomerSiteFilter';
import { CustomerSite } from '../models/CustomerSite';

describe('CustomerSiteService', () => {
  let service: CustomerSiteService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CustomerSiteService
      ]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(CustomerSiteService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all customers sites', () => {
    const mockResponse = { data: [], page: 1, size: 100, totalItems: 1, totalPages: 1} as BasePaginationResponse<CustomerSite[]>;

    service.getAll({ page: 1, size: 100 } as BasePaginationRequest<CustomerSiteFilter>).subscribe((customersSites) => {
      expect(customersSites).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/match/customer-site');
    expect(req.request.method).toEqual('POST');

    req.flush(mockResponse);
  });

  it('should get customer site for a given id', () => {
    const mockResponse = {
      id: 1,
      name: 'Site Sophia Amadeus',
      address: 'address Sophia',
      contact: null,
      customerId: 1,
      customer: { id: 1, name: 'Amadeus' } as Customer
    } as CustomerSite;

    service.get(1).subscribe((customer) => {
      expect(customer).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/match/customer-site/1');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });

  it('should update customer site', () => {
    const mockRequestAndResponse = {
      id: 1,
      name: 'Site Sophia Amadeus',
      address: 'address Sophia',
      contact: null,
      customerId: 1,
      customer: { id: 1, name: 'Amadeus' } as Customer
    } as CustomerSite;

    service.update(mockRequestAndResponse).subscribe((customer) => {
      expect(customer).toBe(mockRequestAndResponse);
    });

    const req = httpTestingController.expectOne('/api/match/customer-site/1');
    expect(req.request.method).toEqual('PUT');

    req.flush(mockRequestAndResponse);
  });

  it('should create a customer site', () => {
    const mockResponse = {
      id: 1,
      name: 'Site Sophia Amadeus',
      address: 'address Sophia',
      contact: null,
      customerId: 1,
      customer: { id: 1, name: 'Amadeus' } as Customer
    } as CustomerSite;
    service.create(mockResponse).subscribe(customer => {
      expect(customer).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/match/customer-site/create');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toBe(mockResponse);

    req.flush(mockResponse);
  });

  it('should delete customer site', () => {
    service.delete(1).subscribe();

    const req = httpTestingController.expectOne('/api/match/customer-site/1');
    expect(req.request.method).toEqual('DELETE');

    req.flush({});
  });
});
