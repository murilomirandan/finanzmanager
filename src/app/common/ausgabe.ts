import { AusgabeKategorie } from "./ausgabe-kategorie";

export class Ausgabe {
  id: number;
  beschreibung: string;
  wert: number;
  datum: Date;
  kategorieId: AusgabeKategorie;
}
