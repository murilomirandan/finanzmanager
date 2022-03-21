import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, Validators } from '@angular/forms';

import { Ausgabe } from 'src/app/common/ausgabe';
import { AusgabeService } from 'src/app/services/ausgabe.service';
import { AusgabeKategorie } from 'src/app/common/ausgabe-kategorie';
import { Shared } from '../shared/shared';

@Component({
  selector: 'app-ausgabe',
  templateUrl: './ausgabe.component.html',
  styleUrls: ['./ausgabe.component.css']
})
export class AusgabeComponent implements OnInit {

  currentClass = 'ausgaben';
  addAusgabeForm: FormGroup;
  updateAusgabeForm: FormGroup;

  kategorieOptions:  AusgabeKategorie[] = [
    new AusgabeKategorie(1, "Miete"),
    new AusgabeKategorie(2, "Lebensmittel"),
    new AusgabeKategorie(3, "Freizeit"),
    new AusgabeKategorie(4, "Versicherung"),
    new AusgabeKategorie(5, "Mobilität"),
    new AusgabeKategorie(6, "Bildung"),
    new AusgabeKategorie(7, "Gesundheit"),
    new AusgabeKategorie(8, "Andere")
  ];

  ausgaben: Ausgabe[];
  ausgabeInModal: Ausgabe;
  emptyAusgabe = new Ausgabe();

  //new properties for pagination
  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;

  //search properties
  searchMode: boolean;
  previousKeyword: string | null = null;

  constructor(private ausgabeService: AusgabeService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) {
    }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getAusgaben();
    });

    this.addAusgabeForm = this.formBuilder.group({
      beschreibung: new FormControl('', [
        Validators.required, Validators.minLength(2), Shared.notOnlyWhitespace]),
      wert: new FormControl('', [Validators.required]),
      datum: new FormControl('', [Validators.required]),
      kategorie: new FormControl('', [Validators.required])
    });

    this.updateAusgabeForm = this.formBuilder.group({
      id:new FormControl('', []),
      beschreibung: new FormControl('', [
        Validators.required, Validators.minLength(2), Shared.notOnlyWhitespace]),
      wert: new FormControl('', [Validators.required]),
      datum: new FormControl('', [Validators.required]),
      kategorie: new FormControl('', [Validators.required])
    });
  }

  getAusgaben() {
    // console.log("getAusgaben()");
    if (this.route.snapshot.paramMap.has('keyword')) {
      this.handleSearchAusgaben();
    }
    else if (this.route.snapshot.paramMap.has('datum')) {
      this.handleSearchBetweenDaten();
    }
    else {
      this.handleListAusgaben();
    }
  }

  handleSearchAusgaben() {
    // console.log("handleSearchAusgaben()");
    const keyword: string = this.route.snapshot.paramMap.get('keyword');

    if (this.previousKeyword != keyword) {
      this.pageNumber = 1;
    }

    this.previousKeyword = keyword;
    console.log(`keyword=${keyword}, pageNumber=${this.pageNumber}`);

    this.ausgabeService.searchAusgaben(keyword,
      this.pageNumber - 1, this.pageSize).subscribe(this.processResult());
  }

  handleSearchBetweenDaten() {
    // console.log("handleAusgabenSearchBetweenDaten()");
    const datum: string = this.route.snapshot.paramMap.get('datum');

    const startDate: string = datum.split("&")[0];
    const endDate: string = datum.split("&")[1];

    this.ausgabeService.searchAusgabenBetweenDaten(startDate, endDate,
      this.pageNumber - 1,
      this.pageSize).subscribe(this.processResult());
  }

  handleListAusgaben() {
    // console.log("handleListAusgaben()");
    this.ausgabeService.getAusgabenPaginate(this.pageNumber - 1,
      this.pageSize).subscribe(this.processResult());
  }


  processResult() {
    return (data: {
      content: Ausgabe[];
      number: number;
      size: number;
      totalElements: number;
    }) => {
      // console.log("Data: " + JSON.stringify(data));
      this.ausgaben = data.content;
      this.pageNumber = data.number + 1;
      this.pageSize = data.size;
      this.totalElements = data.totalElements;
    };
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.getAusgaben();
  }

  // Modals
  public onOpenModal(ausgabe: Ausgabe, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');

    button.type = "button";
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');

    if (mode === 'add') {
      button.setAttribute('data-bs-target', '#addAusgabeModal');
    }
    if (mode === 'update') {
      this.ausgabeInModal = ausgabe;
      this.updateAusgabeForm.setValue({
        id: ausgabe.id,
        beschreibung: ausgabe.beschreibung,
        wert: ausgabe.wert,
        datum: new Date(ausgabe.datum).toISOString().substring(0,10),
        kategorie: ausgabe.kategorie.id
      });

      // console.log(this.updateAusgabeForm);
      // console.log("Ausgabe in update Modal", JSON.stringify(this.ausgabeInModal));
      button.setAttribute('data-bs-target', '#updateAusgabeModal');
    }
    if (mode === 'delete') {
      this.ausgabeInModal = ausgabe;
      button.setAttribute('data-bs-target', '#deleteAusgabeModal');
    }

    container?.appendChild(button);
    button.click();
  }

  public onAddAusgabe(): void {
    if(this.addAusgabeForm.invalid){
      this.addAusgabeForm.markAllAsTouched();
      return;
    }

    let ausgabe = new Ausgabe();
    ausgabe.beschreibung = this.addAusgabeForm.controls['beschreibung'].value;
    ausgabe.wert = this.addAusgabeForm.controls['wert'].value;
    ausgabe.datum = this.addAusgabeForm.controls['datum'].value;
    let kategorieId = this.addAusgabeForm.controls['kategorie'].value;

    let ausgabeKategorie = {...this.kategorieOptions.filter(option => option.id === kategorieId)}[0];
    ausgabe.kategorie = ausgabeKategorie;
    // console.log(`Ausgabe im Add form: ${JSON.stringify(ausgabeKategorie)}`);
    // console.log(`Ausgabe im Add form: ${JSON.stringify(ausgabe)}`);

    this.ausgabeService.addAusgaben(ausgabe).subscribe({
      next: (response: Ausgabe) => {
        console.log(response);
        this.getAusgaben();
        this.addAusgabeForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onUpdateAusgabe(): void {
    if(this.updateAusgabeForm.invalid){
      this.updateAusgabeForm.markAllAsTouched();
      return;
    }

    let ausgabe = new Ausgabe();
    ausgabe.id = this.updateAusgabeForm.controls['id'].value;
    ausgabe.beschreibung = this.updateAusgabeForm.controls['beschreibung'].value;
    ausgabe.wert = this.updateAusgabeForm.controls['wert'].value;
    ausgabe.datum = this.updateAusgabeForm.controls['datum'].value;
    let kategorieId = this.updateAusgabeForm.controls['kategorie'].value;

    let ausgabeKategorie = {...this.kategorieOptions.filter(option => option.id === kategorieId)}[0];
    ausgabe.kategorie = ausgabeKategorie;

    this.ausgabeService.updateAusgabe(ausgabe).subscribe({
      next: (response: Ausgabe) => {
        console.log(response);
        this.getAusgaben();
        this.updateAusgabeForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onDeleteAusgabe(ausgabeId: number): void {
    this.ausgabeService.deleteAusgabe(ausgabeId).subscribe({
      next: (response: void) => {
        console.log(response);
        this.getAusgaben();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }
}

