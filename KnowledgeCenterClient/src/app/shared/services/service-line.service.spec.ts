import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ServiceLineService } from './service-line.service';
import { ServiceLine } from '../models/ServiceLine';

describe('ServiceLineService', () => {
  let service: ServiceLineService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ServiceLineService
      ]
    });
  });

  beforeEach(() => {
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(ServiceLineService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all the service lines', () => {
    const mockResponse = [{ id: 1, name: 'DIT', description: 'Digital Innovation And Technology' } as ServiceLine];

    service.getAll().subscribe((serviceLines) => {
      expect(serviceLines).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/serviceline');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });

  it('should get a service line for a given id', () => {
    const mockResponse = { id: 1, name: 'DIT', description: 'Digital Innovation And Technology' } as ServiceLine;

    service.get(1).subscribe((agency) => {
      expect(agency).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/serviceline/1');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });

  it('should create a service line', () => {
    const mockResponse = { id: 1, name: 'DIT', description: 'Digital Innovation And Technology' } as ServiceLine;
    const body = { name: 'DIT', description: 'Digital Innovation And Technology' } as ServiceLine;
    service.create(body).subscribe(serviceLine => {
      expect(serviceLine).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/serviceline');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toBe(body);

    req.flush(mockResponse);
  });

  it('should update', () => {
    const mockResponse = { id: 1, name: 'DIT', description: 'Digital Innovation And Technology' } as ServiceLine;
    const body = { id: 1, name: 'DIT', description: 'Digital Innovation And Technology' } as ServiceLine;

    service.update(body).subscribe(agency => {
      expect(agency).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/serviceline/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBe(body);

    req.flush(mockResponse);
  });

  it('should delete service line', () => {
    service.delete(1).subscribe();

    const req = httpTestingController.expectOne('/api/serviceline/1');
    expect(req.request.method).toEqual('DELETE');

    req.flush({});
  });
});
