import { TestBed } from '@angular/core/testing';

import { ConfigurationsService } from './configurations.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { EnvironmentConfigurations } from '../../core/models/EnvironmentConfigurations';
import { of } from 'rxjs';
import { LastTokens } from '../../core/models/LastTokens';

describe('ConfigurationsService', () => {
  let service: ConfigurationsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ConfigurationsService
      ]
    });
  });

  beforeEach(() => {
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(ConfigurationsService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should ping start point', () => {
    const mockResponse = { environment: 'Development' } as EnvironmentConfigurations;

    service.ping(true).subscribe((configurations) => {
      expect(configurations).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/configurations/ping');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });

  it('should ask to initialize E2E testing data', () => {
    service.initializeE2ETestingData().subscribe((isSuccess) => {
      expect(isSuccess).toBeTruthy();
    });

    const req = httpTestingController.expectOne('/api/configurations/e2e/init');
    expect(req.request.method).toEqual('POST');

    req.flush(of(true));
  });

  it('should get last tokens', () => {
    const mockResponse = { activationToken: 'abc', recoverPasswordToken: 'xyz' } as LastTokens;

    service.getLastTokens().subscribe((configurations) => {
      expect(configurations).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/configurations/e2e/lasttokens');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });
});
