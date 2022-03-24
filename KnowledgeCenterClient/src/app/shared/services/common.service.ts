import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Country } from '../models/Country';
import { Resolve } from '@angular/router';

@Injectable()
export class CommonService {

  private url = '/api/common';

  constructor(private http: HttpClient) { }

  public getCountries = (): Observable<Country[]> => {
    return this.http.get<Country[]>(`${this.url}/country`);
  }
}

@Injectable()
export class CountryResolver implements Resolve<Country[]> {
  constructor(private commonService: CommonService) {}
  resolve(): Observable<Country[]> {
    return this.commonService.getCountries();
  }
}
