import { TestBed } from '@angular/core/testing';

import { TagsService } from './tags.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('TagsService', () => {
  let service: TagsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        TagsService
      ]
    });
  });

  beforeEach(() => {
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(TagsService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
