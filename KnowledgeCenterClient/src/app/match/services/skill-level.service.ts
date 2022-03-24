import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SkillLevel } from '../models/SkillLevel';

@Injectable()
export class SkillLevelService {

  private url = '/api/match/skill-level';

  constructor(private http: HttpClient) { }

  public getAll = (): Observable<SkillLevel[]> => {
    return this.http.get<SkillLevel[]>(`${this.url}`);
  }
}
