import { TestBed } from '@angular/core/testing';

import { ScrollEventsService } from './scroll-events.service';

describe('ScrollEventsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScrollEventsService = TestBed.get(ScrollEventsService);
    expect(service).toBeTruthy();
  });
});
