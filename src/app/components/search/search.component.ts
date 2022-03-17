import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Input() table = '';
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  doSearch(value: string): void {
    console.log(`/search/${this.table}/${value}`);
    this.router.navigateByUrl(`/search/${this.table}/${value}`);
  }
}
