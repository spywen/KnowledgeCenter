import { TestBed } from '@angular/core/testing';
import { SkillLevelService } from './skill-level.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SkillLevel } from '../models/SkillLevel';

describe('SkillLevelService', () => {
  let service: SkillLevelService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        SkillLevelService
      ]
    });
  });

  beforeEach(() => {
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(SkillLevelService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all skill levels', () => {
    const mockResponse = [
      {
        id: 1,
        name: 'Novice',
        order: 1,
      } as SkillLevel
    ] as SkillLevel[];

    service.getAll().subscribe(skillLevels => {
      expect(skillLevels).toBe(mockResponse);
    });

    const req = httpTestingController.expectOne('/api/match/skill-level');
    expect(req.request.method).toEqual('GET');

    req.flush(mockResponse);
  });
});
