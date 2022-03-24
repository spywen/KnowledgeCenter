import { TestBed } from '@angular/core/testing';
import { CustomersService } from './customers.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BasePaginationRequest, BasePaginationResponse } from '../../shared/models/BasePagination';
import { Customer } from '../models/Customer';
import { CustomerFilter } from '../models/CustomerFilter';

describe('CustomersService', () => {
  let service: CustomersService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CustomersService
      ]
    });
  });

  beforeEach(() => {
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(CustomersService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all customers', () => {
    const mockResponse = { data: [], page: 1, size: 100, totalItems: 1, totalPages: 1} as BasePaginationResponse<Customer[]>;

    service.getAll({ page: 1, size: 100 } as BasePaginationRequest<CustomerFilter>).subscribe((customers) => {
      expect(customers).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/match/customer');
    expect(req.request.method).toEqual('POST');

    req.flush(mockResponse);
  });

  it('should get customer for a given id', () => {
    const mockResponse = { id: 1, name: 'Amadeus' } as Customer;

    service.get(1).subscribe((customer) => {
      expect(customer).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/match/customer/1');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });

  it('should update customer', () => {
    const mockRequestAndResponse = { id: 1, name: 'Amadeus' } as Customer;

    service.update(mockRequestAndResponse).subscribe((customer) => {
      expect(customer).toBe(mockRequestAndResponse);
    });

    const req = httpTestingController.expectOne('/api/match/customer/1');
    expect(req.request.method).toEqual('PUT');

    req.flush(mockRequestAndResponse);
  });

  it('should create a customer', () => {
    const mockResponse = { id: 1, name: 'Amadeus' } as Customer;
    service.create(mockResponse).subscribe(customer => {
      expect(customer).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/match/customer/create');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toBe(mockResponse);

    req.flush(mockResponse);
  });

  it('should delete customer', () => {
    service.delete(1).subscribe();

    const req = httpTestingController.expectOne('/api/match/customer/1');
    expect(req.request.method).toEqual('DELETE');

    req.flush({});
  });
});
