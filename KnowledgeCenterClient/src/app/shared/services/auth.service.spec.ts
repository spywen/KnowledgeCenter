import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Credentials } from '../models/Credentials';
import { Tokens } from '../models/Tokens';

describe('AuthService', () => {
  let service: AuthService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AuthService
      ]
    });
  });

  beforeEach(() => {
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(AuthService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should execute correct login call', () => {
    const mockToken = { token: '[TOKEN]', refreshToken: '[REFRESHTOKEN]' } as Tokens;

    service.login({ login: 'toto', password: 'abc' } as Credentials)
      .subscribe(token => {
        expect(token).toBe(mockToken);
      });

    const req = httpTestingController.expectOne('/api/auth/login');
    expect(req.request.method).toEqual('POST');

    req.flush(mockToken);
  });

  it('should execute correct refresh token call', () => {
    const resultMock = { token: 'ABC', refreshToken: 'XYZ' } as Tokens;

    service.refreshTokens(resultMock)
      .subscribe(token => {
        expect(token).toBe(resultMock);
      });

    const req = httpTestingController.expectOne('/api/auth/refresh');
    expect(req.request.method).toEqual('POST');

    req.flush(resultMock);
  });

  it('should execute correct logout call', () => {
    service.logout().subscribe();

    const req = httpTestingController.expectOne('/api/auth/logout');
    expect(req.request.method).toEqual('POST');

    req.flush(null);
  });

});
