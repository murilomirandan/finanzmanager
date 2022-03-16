import { TestBed } from '@angular/core/testing';

import { EinnahmeService } from './einnahme.service';

describe('EinnahmeService', () => {
  let service: EinnahmeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EinnahmeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
