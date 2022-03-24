import { TestBed } from '@angular/core/testing';

import { AuthGuardService } from './auth-guard.service';
import { RouterTestingModule } from '@angular/router/testing';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

describe('AuthGuardService', () => {
  let service: AuthGuardService;
  const defaultRoute = {
    data: { acceptedRoles: ['ADMIN'] }
  } as any;
  const defaultState = {
    url: '/test'
  } as any;

  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      RouterTestingModule
    ],
    providers: [
      AuthGuardService,
      { provide: TokenService, useValue: {
        isAuthenticated: () => {},
        hasOneOfRoles: () => {},
        getTokenProfile: () => {},
        removeToken: () => {}
      }}
    ]
  }));

  beforeEach(() => {
    service = TestBed.get(AuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should accept routing when user token is valid and not expired and contains at least one necessary role', () => {
    spyOn(TestBed.get(TokenService), 'isAuthenticated').and.returnValue(true);
    spyOn(TestBed.get(TokenService), 'hasOneOfRoles').and.returnValue(true);

    const isRoutingAccepted = service.canActivate(defaultRoute, defaultState);

    expect(isRoutingAccepted).toBeTruthy();
  });

  it('should not accept routing when user token is valid and not expired but does not contains at least one necessary role', () => {
    spyOn(TestBed.get(TokenService), 'isAuthenticated').and.returnValue(true);
    spyOn(TestBed.get(TokenService), 'hasOneOfRoles').and.returnValue(false);

    const isRoutingAccepted = service.canActivate(defaultRoute, defaultState);

    expect(isRoutingAccepted).not.toBeTruthy();
  });

  it('should not accept routing ' +
  'and redirect to login page ' +
  'when no token found in browser memory ', () => {
    spyOn(TestBed.get(TokenService), 'isAuthenticated').and.returnValue(false);
    spyOn(TestBed.get(TokenService), 'getTokenProfile').and.returnValue(undefined);
    const routerSpy = spyOn(TestBed.get(Router), 'navigate');

    service.canActivate(defaultRoute, defaultState);

    expect(routerSpy).toHaveBeenCalledWith(['login'], { queryParams: { returnUrl: defaultState.url }});
  });
});
