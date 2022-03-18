import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Einnahme } from 'src/app/common/einnahme';
import { EinnahmeService } from 'src/app/services/einnahme.service';

@Component({
  selector: 'app-einnahme',
  templateUrl: './einnahme.component.html',
  styleUrls: ['./einnahme.component.css']
})
export class EinnahmeComponent implements OnInit {

  currentClass = 'einnahmen';

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
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getEinnahmen();
    })
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
}
