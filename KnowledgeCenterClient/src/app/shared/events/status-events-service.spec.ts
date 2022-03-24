import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { StatusEventsService } from './status-events-service';

describe('StatusEventsService', () => {
  let service: StatusEventsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        StatusEventsService
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(StatusEventsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('HTTP', () => {
    it('should return false as status by default', () => {
      service.getHttpStatus().subscribe(status => {
        expect(status).toBeFalsy();
      });
    });

    it('should return true as status when status set to true', () => {
      service.setHttpStatus(true);

      service.getHttpStatus().subscribe(status => {
        expect(status).toBeTruthy();
      });
    });
  });

  describe('ROUTING', () => {
    it('should return false as status by default', () => {
      service.getRoutingStatus().subscribe(status => {
        expect(status).toBeFalsy();
      });
    });

    it('should return true as status when status set to true', () => {
      service.setRoutingStatus(true);

      service.getRoutingStatus().subscribe(status => {
        expect(status).toBeTruthy();
      });
    });
  });

  describe('REFRESH TOKENS OPERATION', () => {
    it('should return false when no refresh tokens operation in progress by default', () => {
        expect(service.isRefreshTokensOperationInProgress()).toBeFalsy();
    });

    it('should return correct status when refresh tokens operation is started or stopped', () => {
      service.startRefreshTokensOperation();

      expect(service.isRefreshTokensOperationInProgress()).toBeTruthy();

      service.stopRefreshTokensOperation();

      expect(service.isRefreshTokensOperationInProgress()).toBeFalsy();
    });

    it('should raised tokensRefreshed event when stop refresh tokens operation is targetted', fakeAsync(() => {
      let hasBeenCalled = false;
      service.tokensRefreshed().subscribe(() => {
        hasBeenCalled = true;
      });

      service.stopRefreshTokensOperation();
      tick(100);
      expect(hasBeenCalled).toBeTruthy();
    }));
  });

});
