import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  @Input() classTable = 'test';

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  doSearch(className:string, value: string): void {
    console.log(`/${className}/search/${value}`);
    this.router.navigateByUrl(`/${className}/search/${value}`);
  }

  onCancel(className: string){
    this.router.navigateByUrl(`/${className}/cancel`);
  }
}
