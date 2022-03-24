import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { Resolve } from '@angular/router';
import { Collaborator, CreateOrUpdateCollaborator } from '../models/Collaborator';
import { ServiceLineService } from '../../shared/services/service-line.service';
import { AgencyService } from '../../shared/services/agency.service';
import { CollaboratorFilter } from '../models/CollaboratorFilter';
import { CollaboratorSkill } from '../models/CollaboratorSkill';
import { BasePaginationResponse, BasePaginationRequest } from 'src/app/shared/models/BasePagination';
import { SkillService } from './skill.service';
import { SkillLevelService } from './skill-level.service';

export const DEFAULT_COLLABORATOR_PER_PAGE = 20;

@Injectable({
  providedIn: 'root'
})
export class CollaboratorsService {

  private url = '/api/match/collaborator';

  constructor(
    private http: HttpClient
  ) { }

  public create = (collaborator: CreateOrUpdateCollaborator): Observable<Collaborator> => {
    return this.http.post<Collaborator>(`${this.url}/create`, collaborator);
  }

  public edit = (collaborator: CreateOrUpdateCollaborator): Observable<Collaborator> => {
    return this.http.put<Collaborator>(`${this.url}`, collaborator);
  }

  public delete = (id: number): Observable<any> => {
    return this.http.delete(`${this.url}/${id}`);
  }

  public getAll = (query: BasePaginationRequest<CollaboratorFilter>, isAsync: boolean = false): Observable<BasePaginationResponse<Collaborator[]>> => {
    let headers = new HttpHeaders();
    if (isAsync) {
      headers = headers.set('NOLOADER', '1');
    }
    return this.http.post<BasePaginationResponse<Collaborator[]>>(`${this.url}`, query, { headers });
  }

  public get = (userId: number, isAsync: boolean = false): Observable<Collaborator> => {
    let headers = new HttpHeaders();
    if (isAsync) {
      headers = headers.set('NOLOADER', '1');
    }
    return this.http.get<Collaborator>(`${this.url}/${userId}`, { headers });
  }

  public updateCollaboratorSkills = (collaboratorId: number, newSkills: CollaboratorSkill[]): Observable<CollaboratorSkill[]> => {
    return this.http.put<CollaboratorSkill[]>(`${this.url}/${collaboratorId}/skills`, newSkills);
  }

  public addCollaboratorSkill = (collaboratorId: number, skillToAdd: CollaboratorSkill): Observable<CollaboratorSkill> => {
    return this.http.post<CollaboratorSkill>(`${this.url}/${collaboratorId}/skills`, skillToAdd);
  }

  public deleteCollaboratorSkill = (collaboratorId: number, skillToDeleteId: number): Observable<any> => {
    return this.http.delete(`${this.url}/${collaboratorId}/skills/${skillToDeleteId}`);
  }

  public updateCollaboratorSkillLevel =
    (collaboratorId: number, skillToModifyId: number, skillToModify: CollaboratorSkill): Observable<CollaboratorSkill> => {
      return this.http.put<CollaboratorSkill>(`${this.url}/${collaboratorId}/skills/${skillToModifyId}`, skillToModify);
    }

  public deleteCollaborator = (collaboratorId: number) => {
    return this.http.delete(`${this.url}/${collaboratorId}`);
  }
}

@Injectable()
export class CollaboratorsResolver implements Resolve<any[]> {

  constructor(
    private collaboratorsService: CollaboratorsService,
    private agencyService: AgencyService,
    private serviceLineService: ServiceLineService,
    private skillService: SkillService,
    private skillLevelService: SkillLevelService
  ) {  }

  resolve(): Observable<any[]> {
    const collaboratorsResponse = this.collaboratorsService.getAll({
      page: 1,
      size: DEFAULT_COLLABORATOR_PER_PAGE
    } as BasePaginationRequest<CollaboratorFilter>);
    const agenciesResponse = this.agencyService.getAll();
    const serviceLinesResponse = this.serviceLineService.getAll();
    const skillServiceResponse = this.skillService.getAll();
    const skillLevelServiceResponse = this.skillLevelService.getAll();

    return forkJoin([collaboratorsResponse, agenciesResponse, serviceLinesResponse, skillServiceResponse, skillLevelServiceResponse]);
  }
}
