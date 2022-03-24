import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AgencyService } from './agency.service';
import { Agency } from '../models/Agency';

describe('AgencyService', () => {
  let service: AgencyService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AgencyService
      ]
    });
  });

  beforeEach(() => {
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(AgencyService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all the agencies', () => {
    const mockResponse = [{ id: 1, name: 'Bayonne', postalCode: '64100' } as Agency];

    service.getAll().subscribe((agencies) => {
      expect(agencies).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/agency');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });

  it('should get an agency for a given id', () => {
    const mockResponse = { id: 1, name: 'Bayonne', postalCode: '33700' };

    service.get(1).subscribe((agency) => {
      expect(agency).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/agency/1');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });

  it('should create an agency', () => {
    const mockResponse = { id: 1, name: 'Biot', postalCode: '06410' } as Agency;
    const body = { id: 1, name: 'Biot', postalCode: '06410' } as Agency;
    service.create(body).subscribe(agency => {
      expect(agency).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/agency');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toBe(body);

    req.flush(mockResponse);
  });

  it('should update', () => {
    const mockResponse = { id: 1, name: 'Bordeaux', postalCode: '33700' } as Agency;
    const body = { id: 1, name: 'Bordeaux', postalCode: '33700' } as Agency;

    service.update(body).subscribe(agency => {
      expect(agency).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/agency/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBe(body);

    req.flush(mockResponse);
  });

  it('should delete agency', () => {
    service.delete(1).subscribe();

    const req = httpTestingController.expectOne('/api/agency/1');
    expect(req.request.method).toEqual('DELETE');

    req.flush({});
  });
});
