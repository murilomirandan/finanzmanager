import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

import { Ausgabe } from 'src/app/common/ausgabe';
import { AusgabeService } from 'src/app/services/ausgabe.service';

@Component({
  selector: 'app-ausgabe',
  templateUrl: './ausgabe.component.html',
  styleUrls: ['./ausgabe.component.css']
})
export class AusgabeComponent implements OnInit {

  currentClass = 'ausgaben';

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
    private route: ActivatedRoute) {
    }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.getAusgaben();
    })
  }

  getAusgaben() {
    console.log("getAusgaben()");
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
    console.log("handleSearchAusgaben()");
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
    console.log("handleAusgabenSearchBetweenDaten()");
    const datum: string = this.route.snapshot.paramMap.get('datum');

    const startDate: string = datum.split("&")[0];
    const endDate: string = datum.split("&")[1];

    this.ausgabeService.searchAusgabenBetweenDaten(startDate, endDate,
      this.pageNumber - 1,
      this.pageSize).subscribe(this.processResult());
  }

  handleListAusgaben() {
    console.log("handleListAusgaben()");
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
      console.log("Data: " + JSON.stringify(data));
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
      button.setAttribute('data-bs-target', '#updateAusgabeModal');
    }
    if (mode === 'delete') {
      this.ausgabeInModal = ausgabe;
      button.setAttribute('data-bs-target', '#deleteAusgabeModal');
    }

    container?.appendChild(button);
    button.click();
  }

  public onAddAusgabe(addForm: NgForm): void {
    // document.getElementById('add-ausgabe-form')?.click();
    this.ausgabeService.addAusgaben(addForm.value).subscribe({
      next: (response: Ausgabe) => {
        console.log(response);
        this.getAusgaben();
        addForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        alert(error.message);
      }
    });
  }

  public onUpdateAusgabe(ausgabe: Ausgabe): void {
    this.ausgabeService.updateAusgabe(ausgabe).subscribe({
      next: (response: Ausgabe) => {
        console.log(response);
        this.getAusgaben();
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
