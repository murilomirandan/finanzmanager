import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Input() table: String = "test";
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  doSearch(value: string): void {
    console.log(`/${this.table}/search/${value}`);
    console.log(`/einnahmen/search/${value}`);
    this.router.navigateByUrl(`/einnahmen/search/${value}`);
  }

}
