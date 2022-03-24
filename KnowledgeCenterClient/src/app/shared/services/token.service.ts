import { Injectable } from '@angular/core';
import * as jwt_decode from 'jwt-decode';
import { Md5 } from 'ts-md5/dist/md5';
import { TokenProfile } from '../models/TokenProfile';
import { Tokens } from '../models/Tokens';

export const TOKEN_KEY = 'jwt_token';
export const REFRESH_KEY = 'jwt_refresh_token';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  public getTokens(): Tokens {
    return {
      token: localStorage.getItem(TOKEN_KEY),
      refreshToken: localStorage.getItem(REFRESH_KEY)
    };
  }

  public setTokens(tokens: Tokens): void {
    localStorage.setItem(TOKEN_KEY, tokens.token);
    localStorage.setItem(REFRESH_KEY, tokens.refreshToken);
  }

  public removeTokens(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
  }

  public isAuthenticated(): boolean {
    const token = this.getTokens().token;
    if (!token) { return false; }

    return true;
  }

  public hasOneOfRoles(expectedRoles: string[]): boolean {
    if (this.isAuthenticated() && this.getRoles().some(r => expectedRoles.indexOf(r) >= 0)) {
      return true;
    } else {
      return false;
    }
  }

  public getTokenProfile(): TokenProfile {
    const token = this.getTokens().token;
    if (!token) {
      return null;
    } else {
      const decoded = jwt_decode(token);
      return {
        id: parseInt(decoded.unique_name, 10),
        email: decoded.email,
        login: decoded.nameid,
        roles: this.getRoles()
      } as TokenProfile;
    }
  }

  public getGravatar(size: number): string {
    const token = this.getTokens().token;
    if (!token) {
      return null;
    } else {
      const decoded = jwt_decode(token);
      return this.getGravatarPerEmail(decoded.email, size);
    }
  }

  public getGravatarPerEmail(email: string, size: number): string {
    return `https://www.gravatar.com/avatar/${Md5.hashStr(email)}?s=${size}`;
  }

  private getRoles(): string[] {
    const token = this.getTokens().token;

    if (token === undefined) {
      return [];
    }

    const decoded = jwt_decode(token);

    if (decoded.Role !== undefined) {
      if (decoded.Role instanceof Array) {
        return decoded.Role;
      } else {
        return [decoded.Role];
      }
    } else {
      return [];
    }
  }
}
