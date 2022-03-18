import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit {

  @Input() table: String = 'test';
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

  doSearch(): void {
    const startDatum = new Date(this.form.get('dateRange')?.value.start);
    const endDatum = new Date(this.form.get('dateRange')?.value.end);
    // endDatum.setDate(endDatum.getDate() + 1);

    const value: string = formatDate(startDatum) + "&" + formatDate(endDatum);
    console.log(`/${this.table}/searchbydatum/${value}`);
    console.log(`/einnahmen/searchbydatum/${value}`);
    this.router.navigateByUrl(`/einnahmen/searchbydatum/${value}`);
  }

  onCancel(){
    this.form.reset();
    this.router.navigateByUrl('/einnahmen/cancel');
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
