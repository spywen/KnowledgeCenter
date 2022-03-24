import { TestBed } from '@angular/core/testing';
import { UserService } from './user.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { User } from 'src/app/shared/models/User';

describe('UserService', () => {
  let service: UserService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        UserService
      ]
    });
  });

  beforeEach(() => {
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(UserService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sign in', () => {
    const mockToken = '[TOKEN]';
    const body = { login: 'toto' } as User;

    service.signIn(body).subscribe(token => {
      expect(token).toBe(mockToken);
    });

    const req = httpTestingController.expectOne('/api/user');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toEqual(body);

    req.flush(mockToken);
  });

  it('should activate account', () => {
    const mockResponse = 'jdoe';
    const body = 'ACTIVATIONTOKEN';

    service.activate(body).subscribe(login => {
      expect(login).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/user/activate?token=' + body);
    expect(req.request.method).toEqual('PATCH');
    expect(req.request.body).toBeNull();

    req.flush(mockResponse);
  });

  it('should update', () => {
    const mockResponse = {login: 'toto'} as User;
    const body = { login: 'toto' } as User;

    service.update(body).subscribe(user => {
      expect(user).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/user');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual(body);

    req.flush(mockResponse);
  });

  it('should get all users', () => {
    const mockResponse = [{login: 'toto'} as User];

    service.getAll().subscribe(users => {
      expect(users).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/user/all');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });

  it('should get my profile', () => {
    const mockResponse = {login: 'toto'} as User;

    service.getMe().subscribe(user => {
      expect(user).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/user/me');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });

  it('should get one user profile', () => {
    const mockResponse = {login: 'toto'} as User;

    service.get(1).subscribe(user => {
      expect(user).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/user?id=1');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });

  it('should delete user', () => {
    service.delete(1).subscribe();

    const req = httpTestingController.expectOne('/api/user?id=1');
    expect(req.request.method).toEqual('DELETE');

    req.flush({});
  });
});
