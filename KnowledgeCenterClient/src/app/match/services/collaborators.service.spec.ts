import { TestBed } from '@angular/core/testing';

import { CollaboratorsService } from './collaborators.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { BasePaginationResponse, BasePaginationRequest } from 'src/app/shared/models/BasePagination';
import { Collaborator, CreateOrUpdateCollaborator } from '../models/Collaborator';
import { CollaboratorFilter } from '../models/CollaboratorFilter';
import { CollaboratorSkill } from '../models/CollaboratorSkill';

describe('CollaboratorsService', () => {
  let service: CollaboratorsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        CollaboratorsService
      ]
    });
  });

  beforeEach(() => {
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(CollaboratorsService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all collaborators', () => {
    const mockResponse = { data: [], page: 1, size: 100, totalItems: 1, totalPages: 1} as BasePaginationResponse<Collaborator[]>;

    service.getAll({ page: 1, size: 100 } as BasePaginationRequest<CollaboratorFilter>).subscribe((collaborators) => {
      expect(collaborators).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/match/collaborator');
    expect(req.request.method).toEqual('POST');

    req.flush(mockResponse);
  });

  it('should get collaborator', () => {
    const mockResponse = { id: 1 } as Collaborator;

    service.get(1).subscribe((collaborator) => {
      expect(collaborator).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/match/collaborator/1');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });

  it('should create a collaborator', () => {
    const request = { firstname: 'bob' } as CreateOrUpdateCollaborator;
    const mockResponse = { id: 1, firstname: 'bob' } as Collaborator;
    service.create(request).subscribe(collaborator => {
      expect(collaborator).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/match/collaborator/create');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toBe(request);

    req.flush(mockResponse);
  });

  it('should update a collaborator', () => {
    const request = { id: 1 } as CreateOrUpdateCollaborator;
    const mockResponse = { id: 1 } as Collaborator;
    service.edit(request).subscribe(collaborator => {
      expect(collaborator).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/match/collaborator');
    expect(req.request.method).toEqual('PUT');
    expect(req.request.body).toBe(request);

    req.flush(mockResponse);
  });

  it('should delete customer', () => {
    service.delete(1).subscribe();

    const req = httpTestingController.expectOne('/api/match/collaborator/1');
    expect(req.request.method).toEqual('DELETE');

    req.flush({});
  });

  it('should update collaborator skills', () => {
    const mockRequestAndResponse = [{ id: 1, skillId: 1, skillLevelId: 1} as CollaboratorSkill];

    service.updateCollaboratorSkills(1, mockRequestAndResponse).subscribe((collaborators) => {
      expect(collaborators).toBe(mockRequestAndResponse);
    });

    const req = httpTestingController.expectOne('/api/match/collaborator/1/skills');
    expect(req.request.method).toEqual('PUT');

    req.flush(mockRequestAndResponse);
  });
});
