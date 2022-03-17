import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Einnahme } from '../common/einnahme';

@Injectable({
  providedIn: 'root'
})
export class EinnahmeService {

  private apiServiceUrl = environment.apiBaseUrl +'/einnahmen';

  constructor(private httpClient: HttpClient) { }

  getEinnahmen(): Observable<Einnahme[]>{
    return this.httpClient.get<Einnahme[]>(this.apiServiceUrl);
  }

  getEinnahmenPaginate(page: number, pageSize:number): Observable<Einnahme[]>{
    const searchUrl = `${this.apiServiceUrl}?pageNo=${page}&pageSize=${pageSize}`;
    return this.httpClient.get<Einnahme[]>(searchUrl);
  }

  getEinnahme(einnahmeId: number): Observable<Einnahme>{
    return this.httpClient.get<Einnahme>(`${this.apiServiceUrl}/${einnahmeId}`);
  }

  addEinnahmen(einnahme: Einnahme): Observable<Einnahme>{
    return this.httpClient.post<Einnahme>(this.apiServiceUrl, einnahme);
  }

  updateEinnahme(einnahme: Einnahme): Observable<Einnahme>{
    return this.httpClient.put<Einnahme>(this.apiServiceUrl, einnahme);
  }

  deleteEinnahme(einnahmeId: number): Observable<void>{
    return this.httpClient.delete<void>(`${this.apiServiceUrl}/${einnahmeId}`);
  }

  searchEinnahmen(keyword: string, page: number, pageSize:number): Observable<Einnahme[]>{
    const searchUrl = `${this.apiServiceUrl}/search?beschreibung=${keyword}&pageNo=${page}&pageSize=${pageSize}`;
    return this.httpClient.get<Einnahme[]>(searchUrl);
  }
}
