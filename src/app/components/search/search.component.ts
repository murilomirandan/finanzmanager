import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  // @Input() className: String;
  className = "einnahmen";

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  doSearch(value: string): void {
    console.log(`/${this.className}/search/${value}`);
    console.log(`/${this.className}/search/${value}`);
    this.router.navigateByUrl(`/${this.className}/search/${value}`);
  }

  onCancel(){
    this.router.navigateByUrl(`/${this.className}/cancel`);
  }
}
