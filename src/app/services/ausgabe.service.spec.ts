import { TestBed } from '@angular/core/testing';

import { AusgabeService } from './ausgabe.service';

describe('AusgabeService', () => {
  let service: AusgabeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AusgabeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
