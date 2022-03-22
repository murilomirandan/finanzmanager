import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-scatterplot',
  templateUrl: './scatterplot.component.html',
  styleUrls: ['./scatterplot.component.css']
})
export class ScatterplotComponent implements OnInit {
  @Input() ausgabeInput = [{kategorieName:"x", wert: 2},
    {kategorieName:"y", wert: 5},
    {kategorieName:"z", wert: 3}];


  result: {[key: string]: number } = {};
  y: string[] = [];
  x: number[] = [];
  graph: { data: { y: string[]; x: number[]; type: string; orientation: string }[]; layout: { width: number; height: number; title: string; }; };

  constructor() { }

  ngOnInit(): void {
    console.log(this.ausgabeInput);

    this.ausgabeInput.forEach(obj =>{
      this.result[obj['kategorieName']] = obj['wert'];
    });

    this.y = Object.keys(this.result);
    this.x = Object.values(this.result);

    console.log("AusgabeInput: ", this.ausgabeInput);
    console.log("Result: ", this.result);
    console.log("X: ", this.x);
    console.log("Y: ", this.y);

    this.graph = {
      data: [
          { x: this.x, y: this.y, type: 'bar', orientation: 'h' }
      ],
      layout: {width: 450, height: 540, title: 'Ausgabe per Kategorie'}
    };
  }
}
