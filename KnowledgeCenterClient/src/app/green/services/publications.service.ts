import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { Publication } from '../models/Publication';
import { CreateOrUpdatePublication } from '../models/CreateOrUpdatePublication';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { SimpleEnum } from 'src/app/shared/models/SimpleEnum';
import { map } from 'rxjs/operators';
import { LoadPublicationsObjectResolver } from '../models/LoadPublicationsObjectResolver';

export const DEFAULT_GREEN_PUBLICATION_PER_PAGE = 12;

@Injectable({
  providedIn: 'root'
})
export class PublicationsService {

  private url = '/api/green/publications';

  constructor(private http: HttpClient) { }

  public getLastPublication = (): Observable<Publication> => {
    return this.http.get<Publication>(`${this.url}/last`);
  }

  public get = (id: number): Observable<Publication> => {
    return this.http.get<Publication>(`${this.url}/${id}`);
  }

  public delete = (id: number): Observable<any> => {
    return this.http.delete(`${this.url}/${id}`);
  }

  public create = (publication: CreateOrUpdatePublication): Observable<Publication> => {
    return this.http.post<Publication>(`${this.url}/create`, publication);
  }

  public update = (publication: CreateOrUpdatePublication): Observable<Publication> => {
    return this.http.put<Publication>(`${this.url}/update`, publication);
  }

  public getAllPublications = (): Observable<Publication[]> => {
    return this.http.get<Publication[]>(`${this.url}`);
  }

  public getAllPublicationTypes = (): Observable<SimpleEnum[]> => {
    return this.http.get<SimpleEnum[]>(`${this.url}/types`);
  }
}

@Injectable()
export class GreenPublicationsResolver implements Resolve<LoadPublicationsObjectResolver> {
  constructor(
    private publicationsService: PublicationsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<LoadPublicationsObjectResolver> {
      return forkJoin([this.publicationsService.getAllPublications(), this.publicationsService.getAllPublicationTypes()]).pipe(
        map(results => {
          return {
            publications: results[0],
            publicationTypes: results[1]
          } as LoadPublicationsObjectResolver;
        })
      );
  }
}

@Injectable()
export class GreenArdoiseResolver implements Resolve<Observable<Publication>> {
  constructor(
    private publicationsService: PublicationsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Publication> {
      return this.publicationsService.getLastPublication();
  }
}

@Injectable()
export class GreenArdoisePreviewResolver implements Resolve<Observable<Publication>> {
  constructor(
    private publicationsService: PublicationsService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Publication> {
      const publicationId = route.params.publicationId;
      if (publicationId !== null) {
        return this.publicationsService.get(parseInt(publicationId, 10));
      }
  }
}
