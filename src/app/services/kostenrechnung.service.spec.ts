import { TestBed } from '@angular/core/testing';

import { KostenrechnungService } from './kostenrechnung.service';

describe('KostenrechnungService', () => {
  let service: KostenrechnungService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KostenrechnungService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
