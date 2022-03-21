import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Ausgabe } from '../common/ausgabe';

@Injectable({
  providedIn: 'root'
})
export class AusgabeService {

  private apiServiceUrl = environment.apiBaseUrl +'/ausgaben';

  constructor(private httpClient: HttpClient) { }

  addAusgaben(ausgabe: Ausgabe): Observable<Ausgabe> {
    console.log("Ausgabe from Service: ", JSON.stringify(ausgabe));
    return this.httpClient.post<Ausgabe>(this.apiServiceUrl, ausgabe);
  }

  updateAusgabe(ausgabe: Ausgabe): Observable<any> {
    console.log(JSON.stringify(ausgabe));
    return this.httpClient.put<Ausgabe>(this.apiServiceUrl, ausgabe);
  }

  deleteAusgabe(ausgabeId: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiServiceUrl}/${ausgabeId}`);
  }

  getAusgabenPaginate(page: number, pageSize: number): Observable<GetResponseAusgaben> {
    const searchUrl = `${this.apiServiceUrl}?pageNo=${page}&pageSize=${pageSize}`;
    return this.httpClient.get<GetResponseAusgaben>(searchUrl);
  }

  searchAusgaben(keyword: string, page: number, pageSize: number): Observable<GetResponseAusgaben> {
    const searchUrl = `${this.apiServiceUrl}/search?beschreibung=${keyword}&pageNo=${page}&pageSize=${pageSize}`;
    console.log(searchUrl);
    return this.httpClient.get<GetResponseAusgaben>(searchUrl);
  }

  searchAusgabenBetweenDaten(startDate: string, endDate: string, page: number, pageSize: number): Observable<GetResponseAusgaben> {
    const searchUrl = `${this.apiServiceUrl}/searchbydatum?startDatum=${startDate}&endDatum=${endDate}&pageNo=${page}&pageSize=${pageSize}`;
    return this.httpClient.get<GetResponseAusgaben>(searchUrl);
  }
}

interface GetResponseAusgaben {
  content: Ausgabe[],
  size: number,
  totalElements: number,
  totalPages: number,
  number: number
}
