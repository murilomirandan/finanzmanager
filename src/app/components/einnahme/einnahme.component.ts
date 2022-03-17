import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute } from '@angular/router';
import { Einnahme } from 'src/app/common/einnahme';
import { EinnahmeService } from 'src/app/services/einnahme.service';

@Component({
  selector: 'app-einnahme',
  templateUrl: './einnahme.component.html',
  styleUrls: ['./einnahme.component.css']
})
export class EinnahmeComponent implements OnInit {
  className: 'einnahmen';

  einnahmen: Einnahme[];
  einnahmeInModal: Einnahme;
  emptyEinnahme = new Einnahme();

  form: FormGroup;

  //new properties for pagination
  pageNumber: number = 1;
  pageSize: number = 5;
  totalElements: number = 0;
  previousKeyword: string | null = null;

  //search properties
  searchMode: boolean;

  constructor(private einnahmeService: EinnahmeService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getEinnahmenPaginate();

    this.form = this.formBuilder.group({
      dateRange: new FormGroup({
        start: new FormControl(),
        end: new FormControl()
      })
    });
  }

  public getEinnahmenPaginate(): void {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchEinnahmen();
    }else{
      this.handleListEinnahmen();
    }
  }

  handleSearchEinnahmen() {
    const keyword: string = this.route.snapshot.paramMap.get('keyword');

    this.einnahmeService.searchEinnahmen(keyword, this.pageNumber - 1, this.pageSize).subscribe({
      next: (einnahmenData: Einnahme[]) => {
        this.einnahmen = einnahmenData;
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  handleListEinnahmen(){
    this.einnahmeService.getEinnahmenPaginate(this.pageNumber - 1, this.pageSize).subscribe({
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
        this.getEinnahmenPaginate();
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
        this.getEinnahmenPaginate();
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
        this.getEinnahmenPaginate();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
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
    this.getEinnahmenPaginate();
    this.form.reset();
  }

  // pagination
  updatePageSize(pageSize: number){
    this.pageSize = pageSize;
    this.pageNumber = 1;
    this.getEinnahmenPaginate();
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
