import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ausgabe } from 'src/app/common/ausgabe';
import { Einnahme } from 'src/app/common/einnahme';
import { KostenrechnungService } from 'src/app/services/kostenrechnung.service';

@Component({
  selector: 'app-kostenrechnung',
  templateUrl: './kostenrechnung.component.html',
  styleUrls: ['./kostenrechnung.component.css']
})
export class KostenrechnungComponent implements OnInit {
  currentClass = 'kostenrechnung';

  tableKategorie: {kategorieName: string, wert: number}[];
  totalAusgaben = 0;
  totalEinnahmen = 0;

  constructor(private route: ActivatedRoute,
    private kostenrechnungService: KostenrechnungService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getKostenrechnung();
    })
  }

  getKostenrechnung() {
    if (this.route.snapshot.paramMap.has('datum')) {
      this.handleSearchBetweenDaten();
    }else {
      this.handleKostenrechnung();
    }
  }

  handleSearchBetweenDaten(){
    const datum: string = this.route.snapshot.paramMap.get('datum');

    const startDate: string = datum.split("&")[0];
    const endDate: string = datum.split("&")[1];

    this.kostenrechnungService.getAusgabenBetweenDaten(startDate, endDate).subscribe(this.processResultAusgaben());
    this.kostenrechnungService.getEinnahmenBetweenDaten(startDate, endDate).subscribe(this.processResultEinnahmen());
  }

  handleKostenrechnung() {
    this.kostenrechnungService.getAusgaben().subscribe(this.processResultAusgaben());
    this.kostenrechnungService.getEinnahmen().subscribe(this.processResultEinnahmen());
  }

  // array.reduce(callback(accumVariable, curValue[, index[, yourArray]])[, valueInBeginning])
  // callback - executes for each of the elements of the array
  processResultAusgaben() {
    return (data: Ausgabe[]) => {
      this.totalAusgaben = data.reduce((acc, item) => acc + item.wert, 0);
      console.log(`Ausgaben: ${this.totalAusgaben}`);

      // console.log(`AusgabenData: ${JSON.stringify(data)}`);
      this.tableKategorie = data.reduce((acc, item) => {
        let accItem = acc.find(ai => ai.kategorieName === item.kategorie.kategorieName)
        // this.totalAusgaben += accItem.wert;
        if(accItem){
            accItem.wert += item.wert;
        }else{
           acc.push({kategorieName: item.kategorie.kategorieName, wert: item.wert});
        }
        return acc;
      },[])
      console.log(this.tableKategorie);
    };
  }

  processResultEinnahmen() {
    return (data: Einnahme[]) => {
      // console.log(`EinnahmenData: ${JSON.stringify(data)}`);
      this.totalEinnahmen = data.reduce((acc, item) => acc + item.wert, 0);
      console.log(`Einnahmen: ${this.totalEinnahmen}`);
    }
  }
}
