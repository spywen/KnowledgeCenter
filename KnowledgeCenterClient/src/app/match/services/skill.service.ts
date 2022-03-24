import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Skill } from '../models/Skill';
import { Resolve } from '@angular/router';

@Injectable()
export class SkillService {

  private url = '/api/match/skill';

  constructor(private http: HttpClient) { }

  public getAll = (): Observable<Skill[]> => {
    return this.http.get<Skill[]>(`${this.url}`);
  }

  public get = (id: number): Observable<Skill> => {
    return this.http.get<Skill>(`${this.url}/${id}`);
  }

  public create = (skill: Skill): Observable<any> => {
    return this.http.post(`${this.url}`, skill);
  }

  public update = (skill: Skill): Observable<any> => {
    return this.http.put(`${this.url}/${skill.id}`, skill);
  }

  public delete = (id: number): Observable<any> => {
    return this.http.delete(`${this.url}/${id}`);
  }
}

@Injectable()
export class SkillResolver implements Resolve<Skill[]> {
  constructor(private skillService: SkillService) {}
  resolve(): Observable<Skill[]> {
    return this.skillService.getAll();
  }
}
