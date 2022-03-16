import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EinnahmeComponent } from './einnahme.component';

describe('EinnahmeComponent', () => {
  let component: EinnahmeComponent;
  let fixture: ComponentFixture<EinnahmeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EinnahmeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EinnahmeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
