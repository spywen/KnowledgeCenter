import { TestBed } from '@angular/core/testing';
import { ProjectsService } from './projects.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('ProjectService', () => {
  let service: ProjectsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        ProjectsService
      ]
    });
  });

  beforeEach(() => {
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(ProjectsService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
