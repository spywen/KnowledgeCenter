import { Injectable } from '@angular/core';
import { iif, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { User } from 'src/app/shared/models/User';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';

@Injectable()
export class UserService {

  private url = '/api/user';

  constructor(private http: HttpClient) { }

  public signIn = (user: User): Observable<any> => {
    return this.http.post(`${this.url}`, user);
  }

  public activate = (token: string): Observable<string> => {
    return this.http.patch<string>(`${this.url}/activate?token=${token}`, null);
  }

  public update = (user: User): Observable<any> => {
    return this.http.put(`${this.url}`, user);
  }

  public getAll = (): Observable<User[]> => {
    return this.http.get<User[]>(`${this.url}/all`);
  }

  public getMe = (): Observable<User> => {
    return this.http.get<User>(`${this.url}/me`);
  }

  public get = (id: number): Observable<User> => {
    return this.http.get<User>(`${this.url}?id=${id}`);
  }

  public delete = (id: number): Observable<any> => {
    return this.http.delete(`${this.url}?id=${id}`);
  }
}
@Injectable()
export class UsersResolver implements Resolve<User[]> {
  constructor(private userService: UserService) {}
  resolve(): Observable<User[]> {
    return this.userService.getAll();
  }
}
@Injectable()
export class UserResolver implements Resolve<User> {
  constructor(private userService: UserService) {}
  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    const routeId = route.paramMap.get('id');
    const getMyAccount = () => this.userService.getMe();
    const getAccount = (id: number) => this.userService.get(id);
    return iif(() => routeId === null,
      getMyAccount(),
      getAccount(Number(routeId)));
  }
}
