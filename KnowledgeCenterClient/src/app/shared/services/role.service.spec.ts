import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Role } from 'src/app/shared/models/Role';
import { RoleService } from './role.service';

describe('RoleService', () => {
  let service: RoleService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        RoleService
      ]
    });
  });

  beforeEach(() => {
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(RoleService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all roles', () => {
    const mockResponse = [{code: 'ADMIN'} as Role];

    service.getAllRoles().subscribe(roles => {
      expect(roles).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/role');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });

  it('should get user roles', () => {
    const mockResponse = [{code: 'ADMIN'} as Role];

    service.getUserRoles(1).subscribe(roles => {
      expect(roles).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/role/1');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });

  it('should update user roles', () => {
    service.updateUserRoles(1, [1]).subscribe();

    const req = httpTestingController.expectOne('/api/role/1');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toEqual([1]);

    req.flush({});
  });
});
