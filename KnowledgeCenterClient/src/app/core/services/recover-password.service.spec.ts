import { TestBed } from '@angular/core/testing';

import { RecoverPasswordService } from './recover-password.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AskForRecoverPassword, RecoverPassword } from '../models/RecoverPassword';

describe('RecoverPasswordService', () => {
  let service: RecoverPasswordService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        RecoverPasswordService
      ]
    });
  });

  beforeEach(() => {
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(RecoverPasswordService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should ask for new password', () => {
    const body = { email: 'john.doe@capgemini.com' } as AskForRecoverPassword;

    service.ask(body).subscribe();

    const req = httpTestingController.expectOne('/api/password/recover/ask');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(body);

    req.flush({});
  });

  it('should try to recover password', () => {
    const body = { token: 'ABC', newPassword: 'Pa$$w0rd' } as RecoverPassword;

    service.recover(body).subscribe();

    const req = httpTestingController.expectOne('/api/password/recover');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(body);

    req.flush({});
  });
});
