import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Einnahme } from 'src/app/common/einnahme';
import { EinnahmeService } from 'src/app/services/einnahme.service';
import { Shared } from '../shared/shared';

@Component({
  selector: 'app-einnahme',
  templateUrl: './einnahme.component.html',
  styleUrls: ['./einnahme.component.css']
})
export class EinnahmeComponent implements OnInit {

  currentClass = 'einnahmen';
  addEinnahmeForm: FormGroup;
  updateEinnahmeForm: FormGroup;
  deleteEinnahmeForm: FormGroup;
  beschreibungText: string;

  einnahmen: Einnahme[];
  einnahmeInModal: Einnahme;
  emptyEinnahme = new Einnahme();

  //new properties for pagination
  pageNumber: number = 1;
  pageSize: number = 10;
  totalElements: number = 0;

  //search properties
  searchMode: boolean;
  previousKeyword: string | null = null;

  constructor(private einnahmeService: EinnahmeService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getEinnahmen();
    });

    this.addEinnahmeForm = this.formBuilder.group({
      beschreibung: new FormControl('', [
        Validators.required, Validators.minLength(2), Shared.notOnlyWhitespace]),
      wert: new FormControl('', [Validators.required]),
      datum: new FormControl('', [Validators.required]),
    });

    this.updateEinnahmeForm = this.formBuilder.group({
      id: new FormControl('', []),
      beschreibung: new FormControl('', [
        Validators.required, Validators.minLength(2), Shared.notOnlyWhitespace]),
      wert: new FormControl('', [Validators.required]),
      datum: new FormControl('', [Validators.required]),
    });

    this.deleteEinnahmeForm = this.formBuilder.group({
      id: new FormControl('', [])
    });
  }

  getEinnahmen() {
    console.log("getEinnahmen()");
    if (this.route.snapshot.paramMap.has('keyword')) {
      this.handleSearchEinnahmen();
    }
    else if (this.route.snapshot.paramMap.has('datum')) {
      this.handleSearchBetweenDaten();
    }
    else {
      this.handleListEinnahmen();
    }
  }

  handleSearchEinnahmen() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword');

    if (this.previousKeyword != keyword) {
      this.pageNumber = 1;
    }

    this.previousKeyword = keyword;
    console.log(`keyword=${keyword}, pageNumber=${this.pageNumber}`);

    this.einnahmeService.searchEinnahmen(keyword,
      this.pageNumber - 1, this.pageSize).subscribe(this.processResult());
  }

  handleSearchBetweenDaten() {
    console.log("handleSearchBetweenDaten()");
    const datum: string = this.route.snapshot.paramMap.get('datum');

    const startDate: string = datum.split("&")[0];
    const endDate: string = datum.split("&")[1];

    this.einnahmeService.searchEinnahmenBetweenDaten(startDate, endDate,
      this.pageNumber - 1,
      this.pageSize).subscribe(this.processResult());
  }

  handleListEinnahmen() {
    console.log("handleListEinnahmen()");
    this.einnahmeService.getEinnahmenPaginate(this.pageNumber - 1,
      this.pageSize).subscribe(this.processResult());
  }

  // pagination
  private processResult() {
    console.log("processResult()");
    return (data: {
      content: Einnahme[];
      number: number;
      size: number;
      totalElements: number;
    }) => {
      console.log("Data: " + JSON.stringify(data));
      this.einnahmen = data.content;
      this.pageNumber = data.number + 1;
      this.pageSize = data.size;
      this.totalElements = data.totalElements;
    };
  }

  updatePageSize(pageSize: number) {
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.getEinnahmen();
  }

  // Modals
  public onOpenModal(einnahme: Einnahme, mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');

    button.type = "button";
    button.style.display = 'none';
    button.setAttribute('data-bs-toggle', 'modal');

    if (mode === 'add') {
      button.setAttribute('data-bs-target', '#addEinnahmeModal');
    }
    if (mode === 'update') {
      this.einnahmeInModal = einnahme;
      this.updateEinnahmeForm.setValue({
        id: einnahme.id,
        beschreibung: einnahme.beschreibung,
        wert: einnahme.wert,
        datum: new Date(einnahme.datum).toISOString().substring(0, 10)
      });

      button.setAttribute('data-bs-target', '#updateEinnahmeModal');
    }
    if (mode === 'delete') {
      this.deleteEinnahmeForm.setValue({
        id: einnahme.id
      })
      this.beschreibungText = einnahme.beschreibung;

      button.setAttribute('data-bs-target', '#deleteEinnahmeModal');
    }

    container?.appendChild(button);
    button.click();
  }

  public onAddEinnahme(): void {
    if(this.addEinnahmeForm.invalid){
      this.addEinnahmeForm.markAllAsTouched();
      return;
    }

    let einnahme = new Einnahme();
    einnahme.beschreibung = this.addEinnahmeForm.controls['beschreibung'].value;
    einnahme.wert = this.addEinnahmeForm.controls['wert'].value;
    einnahme.datum = this.addEinnahmeForm.controls['datum'].value;

    // document.getElementById('add-einnahme-form')?.click();
    this.einnahmeService.addEinnahmen(einnahme).subscribe({
      next: (response: Einnahme) => {
        console.log(response);
        this.getEinnahmen();
        this.addEinnahmeForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onUpdateEinnahme(): void {
    if(this.updateEinnahmeForm.invalid){
      this.updateEinnahmeForm.markAllAsTouched();
      return;
    }

    let einnahme = new Einnahme();
    einnahme.id = this.updateEinnahmeForm.controls['id'].value;
    einnahme.beschreibung = this.updateEinnahmeForm.controls['beschreibung'].value;
    einnahme.wert = this.updateEinnahmeForm.controls['wert'].value;
    einnahme.datum = this.updateEinnahmeForm.controls['datum'].value;

    this.einnahmeService.updateEinnahme(einnahme).subscribe({
      next: (response: Einnahme) => {
        console.log(response);
        this.getEinnahmen();
        this.updateEinnahmeForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onDeleteEinnahme(): void {
    let einnahmeId = this.deleteEinnahmeForm.controls['id'].value;
    console.log("Einnahme Id: ", einnahmeId);

    this.einnahmeService.deleteEinnahme(einnahmeId).subscribe({
      next: (response: void) => {
        console.log(response);
        this.getEinnahmen();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  get addBeschreibung(){ return this.addEinnahmeForm.get('beschreibung'); }
}
