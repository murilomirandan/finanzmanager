import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit {

  @Input() classTable = 'test';

  constructor(private router: Router,
    private formBuilder: FormBuilder) { }


  form: FormGroup;

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      dateRange: new FormGroup({
        start: new FormControl(),
        end: new FormControl()
      })
    });
  }

  doSearch(className: string): void {
    const startDatum = new Date(this.form.get('dateRange')?.value.start);
    const endDatum = new Date(this.form.get('dateRange')?.value.end);

    const value: string = formatDate(startDatum) + "&" + formatDate(endDatum);
    console.log(`/${className}/searchbydatum/${value}`);
    this.router.navigateByUrl(`/${className}/searchbydatum/${value}`);
  }

  onCancel(className: string){
    this.form.reset();
    this.router.navigateByUrl(`/${className}/cancel`);
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
