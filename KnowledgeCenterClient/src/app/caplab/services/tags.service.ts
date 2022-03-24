import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SimpleEnum } from 'src/app/shared/models/SimpleEnum';

@Injectable()
export class TagsService {

  private url = '/api/caplab/tag';

  constructor(private http: HttpClient) { }

  public getAll = (): Observable<SimpleEnum[]> => {
    return this.http.get<SimpleEnum[]>(`${this.url}`);
  }
}
