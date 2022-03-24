import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BasePaginationRequest, BasePaginationResponse } from 'src/app/shared/models/BasePagination';
import { Observable, forkJoin } from 'rxjs';
import { Project, ProjectType, ProjectFilters, ProjectStatus } from '../models/Project';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { CreateOrUpdateProject } from '../models/CreateOrUpdateProject';
import { SimpleEnum } from 'src/app/shared/models/SimpleEnum';
import { TagsService } from './tags.service';
import { map } from 'rxjs/operators';
import { LoadProjectsObjectResolver } from '../models/LoadProjects';

export const DEFAULT_CAPLAB_PROJECTS_PER_PAGE = 12;

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  private url = '/api/caplab/project';

  constructor(private http: HttpClient) { }

  public get = (id: number): Observable<Project> => {
    return this.http.get<Project>(`${this.url}/${id}`);
  }

  public delete = (id: number): Observable<any> => {
    return this.http.delete(`${this.url}/${id}`);
  }

  public create = (project: CreateOrUpdateProject): Observable<any> => {
    return this.http.post(`${this.url}/create`, project);
  }

  public update = (project: CreateOrUpdateProject): Observable<any> => {
    return this.http.put(`${this.url}/update`, project);
  }

  public getProjectStatuses = (): Observable<SimpleEnum[]> => {
    return this.http.get<SimpleEnum[]>(`${this.url}/status`);
  }

  public updateProjectStatus = (id: string, statusId: string): Observable<any> => {
    return this.http.patch(`${this.url}/${id}/status/${statusId}`, null);
  }

  public rateProject = (id: number, rate: number): Observable<any> => {
    return this.http.patch(`${this.url}/${id}/rate/${rate}`, null);
  }

  public getProjects = (query: BasePaginationRequest<ProjectFilters>): Observable<BasePaginationResponse<Project[]>> => {
    return this.http.post<BasePaginationResponse<Project[]>>(`${this.url}`, query);
  }
}

@Injectable()
export class CaplabProjectsResolver implements Resolve<LoadProjectsObjectResolver> {
  constructor(
    private projectService: ProjectsService,
    private tagService: TagsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<LoadProjectsObjectResolver> {
    const query = {
      page: 1,
      size: DEFAULT_CAPLAB_PROJECTS_PER_PAGE,
      filters: { orderByDescendingCreationDate: true } as ProjectFilters
    } as BasePaginationRequest<ProjectFilters>;
    switch (route.data.type) {
      case ProjectType.PROJECTS:
        query.filters.statusCodes = [ProjectStatus.VALIDATED];
        break;
      case ProjectType.MY:
        query.filters.isOnlyMine = true;
        break;
      case ProjectType.ADMIN:
        query.filters.statusCodes = [ProjectStatus.WAITING];
        break;
      case ProjectType.INPROGRESS:
        query.filters.statusCodes = [ProjectStatus.INPROGRESS];
        break;
      case ProjectType.FINISHED:
        query.filters.statusCodes = [ProjectStatus.FINISHED];
        break;
    }

    return forkJoin([this.tagService.getAll(), this.projectService.getProjectStatuses(), this.projectService.getProjects(query)]).pipe(
      map(results => {
        return {
          tags: results[0],
          projectStatuses: results[1],
          projectsResponse: results[2]
        } as LoadProjectsObjectResolver;
      })
    );
  }
}
