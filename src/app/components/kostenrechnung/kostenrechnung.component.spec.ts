import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KostenrechnungComponent } from './kostenrechnung.component';

describe('KostenrechnungComponent', () => {
  let component: KostenrechnungComponent;
  let fixture: ComponentFixture<KostenrechnungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KostenrechnungComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KostenrechnungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
