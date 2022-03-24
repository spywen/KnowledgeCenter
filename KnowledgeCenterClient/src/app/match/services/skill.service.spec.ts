import { TestBed } from '@angular/core/testing';
import { SkillService } from './skill.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Skill } from '../models/Skill';

describe('SkillService', () => {
  let service: SkillService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        SkillService
      ]
    });
  });

  beforeEach(() => {
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(SkillService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all the skills', () => {
    const mockResponse = [
      {
        id: 1,
        name: 'Agility',
        serviceLineId: 1,
        serviceLine: {
          id: 1,
          name: 'Agile & PM',
          description: 'Agile and Project Management'
        }
      } as Skill,
      {
        id: 2,
        name: 'Agility At Scale',
        serviceLineId: 1,
        serviceLine: {
          id: 1,
          name: 'Agile & PM',
          description: 'Agile and Project Management'
        }
      } as Skill,
    ];

    service.getAll().subscribe((skills) => {
      expect(skills).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/match/skill');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });

  it('should get a skill for a given id', () => {
    const mockResponse = {
      id: 1,
      name: 'Agility',
      serviceLineId: 1,
      serviceLine: {
        id: 1,
        name: 'Agile & PM',
        description: 'Agile and Project Management'
      }
    } as Skill;

    service.get(1).subscribe((skill) => {
      expect(skill).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/match/skill/1');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });

  it('should create a skill', () => {
    const mockResponse = { id: 1,
      name: 'Agility',
      serviceLineId: 1,
      serviceLine: {
        id: 1,
        name: 'Agile & PM',
        description: 'Agile and Project Management'
      } } as Skill;
    const body = { name: 'Agility', serviceLineId: 1 } as Skill;
    service.create(body).subscribe(agency => {
      expect(agency).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/match/skill');
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toBe(body);

    req.flush(mockResponse);
  });

  it('should update', () => {
    const mockResponse = {
      id: 1,
      name: 'Agility',
      serviceLineId: 1,
      serviceLine: {
        id: 1,
        name: 'Agile & PM',
        description: 'Agile and Project Management'
      }
    } as Skill;
    const body = {
      id: 1,
      name: 'Agility',
      serviceLineId: 1,
    } as Skill;

    service.update(body).subscribe(skill => {
      expect(skill).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/match/skill/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toBe(body);

    req.flush(mockResponse);
  });

  it('should delete skill', () => {
    service.delete(1).subscribe();

    const req = httpTestingController.expectOne('/api/match/skill/1');
    expect(req.request.method).toEqual('DELETE');

    req.flush({});
  });
});
