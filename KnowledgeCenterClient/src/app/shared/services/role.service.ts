import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Role } from 'src/app/shared/models/Role';

@Injectable()
export class RoleService {

  private url = '/api/role';

  constructor(private http: HttpClient) { }

  public getAllRoles = (): Observable<Role[]> => {
    return this.http.get<Role[]>(`${this.url}`);
  }

  public getUserRoles = (id: number): Observable<Role[]> => {
    return this.http.get<Role[]>(`${this.url}/${id}`);
  }

  public updateUserRoles = (id: number, newRoleIds: number[]): Observable<any> => {
    return this.http.put(`${this.url}/${id}`, newRoleIds);
  }
}
