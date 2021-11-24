import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { COUNTRY_UNITED_STATES, UniversityInterface } from 'src/app/model/university.type';

@Injectable({
  providedIn: 'root'
})
export class UniversityService{
  baseURL = 'http://universities.hipolabs.com/';

  constructor(
    private httpClient: HttpClient
  ) { }

  searchUniversity(name?: string): Observable<UniversityInterface[]>  {
    let params = new HttpParams();

    params = params.append('country', COUNTRY_UNITED_STATES);
    if(!!name) {
      params = params.append('name', name);
    }
    return this.httpClient.get<UniversityInterface[]>(`${this.baseURL}search`, { params });
  }

}
