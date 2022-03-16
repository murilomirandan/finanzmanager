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

  public getEinnahmen(): Observable<Einnahme[]>{
    return this.httpClient.get<Einnahme[]>(this.apiServiceUrl);
  }

  public getEinnahme(einnahmeId: number): Observable<Einnahme>{
    return this.httpClient.get<Einnahme>(`${this.apiServiceUrl}/${einnahmeId}`);
  }

  public addEinnahmen(einnahme: Einnahme): Observable<Einnahme>{
    return this.httpClient.post<Einnahme>(this.apiServiceUrl, einnahme);
  }

  public updateEinnahme(einnahme: Einnahme): Observable<Einnahme>{
    return this.httpClient.put<Einnahme>(this.apiServiceUrl, einnahme);
  }

  public deleteEinnahme(einnahmeId: number): Observable<void>{
    return this.httpClient.delete<void>(`${this.apiServiceUrl}/${einnahmeId}`);
  }
}
