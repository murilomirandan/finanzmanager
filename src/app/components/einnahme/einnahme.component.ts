import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Einnahme } from 'src/app/common/einnahme';
import { EinnahmeService } from 'src/app/services/einnahme.service';

@Component({
  selector: 'app-einnahme',
  templateUrl: './einnahme.component.html',
  styleUrls: ['./einnahme.component.css']
})
export class EinnahmeComponent implements OnInit {
  einnahmen: Einnahme[];
  einnahmeInModal: Einnahme;
  emptyEinnahme = new Einnahme();

  form: FormGroup;

  constructor(private einnahmeService: EinnahmeService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.getEinnahmen();

    this.form = this.formBuilder.group({
      dateRange: new FormGroup({
        start: new FormControl(),
        end: new FormControl()
      })
    });
  }

  public getEinnahmen(): void {
    this.einnahmeService.getEinnahmen().subscribe({
      next: (einnahmenData: Einnahme[]) => {
        this.einnahmen = einnahmenData;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

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
      button.setAttribute('data-bs-target', '#updateEinnahmeModal');
    }
    if (mode === 'delete') {
      this.einnahmeInModal = einnahme;
      button.setAttribute('data-bs-target', '#deleteEinnahmeModal');
    }

    container?.appendChild(button);
    button.click();
  }

  public onAddEinnahme(addForm: NgForm): void {
    // document.getElementById('add-einnahme-form')?.click();
    this.einnahmeService.addEinnahmen(addForm.value).subscribe({
      next: (response: Einnahme) => {
        console.log(response);
        this.getEinnahmen();
        addForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onUpdateEinnahme(einnahme: Einnahme): void {
    this.einnahmeService.updateEinnahme(einnahme).subscribe({
      next: (response: Einnahme) => {
        console.log(response);
        this.getEinnahmen();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onDeleteEinnahme(einnahmeId: number): void {
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

  public searchEinnahmen(key: string): void {
    const results: Einnahme[] = [];
    for (const einnahme of this.einnahmen) {
      if (einnahme.beschreibung.toLowerCase().indexOf(key.toLowerCase()) !== -1) {
        results.push(einnahme);
      }
    }

    this.einnahmen = results;
    if (results.length === 0 || !key) {
      this.getEinnahmen();
    }
  }

  public searchZwischenDaten(): void {
    const results: Einnahme[] = [];
    const startDatum = new Date(this.form.get('dateRange')?.value.start);
    const endDatum = new Date(this.form.get('dateRange')?.value.end);
    // console.log(`Start: ${startDatum}, End: ${endDatum}`);
    endDatum.setDate(endDatum.getDate() + 1);

    for (const einnahme of this.einnahmen) {
      let checkDatum: Date = new Date(formatDate(einnahme.datum));
      // console.log(`Einnahme: ${einnahme.id} ${checkDatum}`);
      // console.log(checkDatum >= startDatum && checkDatum <= endDatum);

      if (checkDatum >= startDatum && checkDatum <= endDatum){
        results.push(einnahme);
      }
    }
    this.einnahmen = results;
  }

  public onCancel(){
    this.getEinnahmen();
    this.form.reset();
  }
}

function formatDate(date: Date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}
