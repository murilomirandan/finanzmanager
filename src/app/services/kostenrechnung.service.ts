import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Ausgabe } from '../common/ausgabe';
import { Observable } from 'rxjs';
import { Einnahme } from '../common/einnahme';

@Injectable({
  providedIn: 'root'
})
export class KostenrechnungService {

  private apiAusgaben = environment.apiBaseUrl +'/ausgaben';
  private apiEinnahmen = environment.apiBaseUrl +'/einnahmen';

  constructor(private httpClient: HttpClient) { }

  getAusgaben(): Observable<Ausgabe[]> {
    return this.httpClient.get<Ausgabe[]>(`${this.apiAusgaben}/all`);
  }

  getAusgabenBetweenDaten(startDate: string, endDate: string) {
    return this.httpClient.get<Ausgabe[]>(`${this.apiAusgaben}/date?startDatum=${startDate}&endDatum=${endDate}`)
  }

  getEinnahmen(): Observable<Einnahme[]> {
    return this.httpClient.get<Einnahme[]>(`${this.apiEinnahmen}/all`);
  }

  getEinnahmenBetweenDaten(startDate: string, endDate: string) {
    return this.httpClient.get<Einnahme[]>(`${this.apiEinnahmen}/date?startDatum=${startDate}&endDatum=${endDate}`)
  }

}
