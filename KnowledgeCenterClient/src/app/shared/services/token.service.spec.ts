import { TestBed } from '@angular/core/testing';

import { TokenService } from './token.service';
import { Md5 } from 'ts-md5/dist/md5';
import { Tokens } from '../models/Tokens';

// TOKEN WITH ROLES: ADMIN, PREVIEW, etc...
const TOKENS = { refreshToken: 'ahnyGff0RdatvAfXm+M4z0a+36TNltXWiqPvHG1M7Bc=', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjEiLCJl' +
'bWFpbCI6InRvdG9AaG90bWFpbC5mciIsIm5hbWVpZCI6InRvdG8iLCJpYXQiOiIxNTU4MTg3MjQyIiwi' +
'c3ViIjoiS25vd2xlZGdlQ2VudGVyVG9rZW5JZCIsImp0aSI6IjQ0NzNhMmYxLTM4ZmQtNDFkYy1hMzA1L' +
'WRjOGFiNGEzNGZlNCIsIlJvbGUiOlsiQURNSU4iXSwiZXhwIjo5NTUwNzc5MjQyLCJpc3MiOiJLbm93bGV' +
'kZ2VDZW50ZXJTZXJ2ZXIiLCJhdWQiOiJLbm93bGVkZ2VDZW50ZXJDbGllbnQifQ.QVyxCk7mVj3mJswCvcU9fxsKzTlUNQLaNUX1iSN3r4o' } as Tokens;
const EXPIRED_TOKENS = { refreshToken: 'ahnyGff0RdatvAfXm+M4z0a+36TNltXWiqPvHG1M7Bc=', token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6' +
'IjEiLCJlbWFpbCI6InRvdG9AaG90bWFpbC5mciIsIm5hbWVpZCI6InRvdG8iLCJpYXQiOiIxNTU4MTg3' +
'MjQyIiwic3ViIjoiS25vd2xlZGdlQ2VudGVyVG9rZW5JZCIsImp0aSI6IjQ0NzNhMmYxLTM4ZmQtNDFkY' +
'y1hMzA1LWRjOGFiNGEzNGZlNCIsIlJvbGUiOlsiQURNSU4iXSwiZXhwIjoxNTUwNzc5MjQyLCJpc3MiOiJ' +
'Lbm93bGVkZ2VDZW50ZXJTZXJ2ZXIiLCJhdWQiOiJLbm93bGVkZ2VDZW50ZXJDbGllbnQifQ.yJA0HEtdO3TNpE3S7w9A8SyKJcF0pKitpX8kHJqBSMQ' } as Tokens;
const TOKEN_KEY = 'jwt_token';
const REFRESH_TOKEN_KEY = 'jwt_refresh_token';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      TokenService
    ]
  }));

  beforeEach(() => {
    service = TestBed.get(TokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set tokens in local storage', () => {
    service.setTokens(TOKENS);

    expect(localStorage.getItem(TOKEN_KEY)).toBe(TOKENS.token);
    expect(localStorage.getItem(REFRESH_TOKEN_KEY)).toBe(TOKENS.refreshToken);
  });

  it('should get tokens from local storage', () => {
    service.setTokens(TOKENS);

    const tokens = service.getTokens();

    expect(tokens).toEqual(TOKENS);
  });

  it('should remove tokens from local storage', () => {
    service.setTokens(TOKENS);

    const tokens = service.removeTokens();

    expect(tokens).toBeUndefined();
  });

  it('isAuthenticated, should return true if token exists', () => {
    service.setTokens(TOKENS);

    const isAuthenticated = service.isAuthenticated();

    expect(isAuthenticated).toBeTruthy();
  });

  it('isAuthenticated, should return false if token does not exists', () => {
    service.removeTokens();

    const isAuthenticated = service.isAuthenticated();

    expect(isAuthenticated).toBeFalsy();
  });

  it('hasOneOfRoles, should return true even if token is no more valid, '
    + 'by the way user system will ask user to log in again in order to access page or proceed request', () => {
    service.setTokens(EXPIRED_TOKENS);

    const hasOneOfRoles = service.hasOneOfRoles(['ADMIN']);

    expect(hasOneOfRoles).toBeTruthy();
  });

  it('hasOneOfRoles, should return false if token is valid but does not contain role BOSS', () => {
    service.setTokens(TOKENS);

    const hasOneOfRoles = service.hasOneOfRoles(['BOSS']);

    expect(hasOneOfRoles).toBeFalsy();
  });

  it('hasOneOfRoles, should return true if token is valid and token contains ADMIN role but not BOSS role', () => {
    service.setTokens(TOKENS);

    const hasOneOfRoles = service.hasOneOfRoles(['ADMIN', 'BOSS']);

    expect(hasOneOfRoles).toBeTruthy();
  });

  it('getTokenProfile, should return profile', () => {
    service.setTokens(TOKENS);

    const profile = service.getTokenProfile();

    expect(profile).toEqual(jasmine.objectContaining({
      id: 1,
      email: 'toto@hotmail.fr',
      login: 'toto',
      roles: [ 'ADMIN' ]
    }));
  });

  it('getTokenProfile, should return null when token does not exist', () => {
    service.removeTokens();

    const profile = service.getTokenProfile();

    expect(profile).toBeNull();
  });

  it('getGravatar, should gravatar url', () => {
    service.setTokens(TOKENS);

    const gravatarUrl = service.getGravatar(128);

    expect(gravatarUrl).toBe(`https://www.gravatar.com/avatar/${Md5.hashStr('toto@hotmail.fr')}?s=128`);
  });

  it('getGravatar, should null if token does not exist', () => {
    service.removeTokens();

    const gravatarUrl = service.getGravatar(128);

    expect(gravatarUrl).toBeNull();
  });
});
