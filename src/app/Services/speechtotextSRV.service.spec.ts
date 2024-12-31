/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SpeechtotextSRVService } from './speechtotextSRV.service';

describe('Service: SpeechtotextSRV', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpeechtotextSRVService]
    });
  });

  it('should ...', inject([SpeechtotextSRVService], (service: SpeechtotextSRVService) => {
    expect(service).toBeTruthy();
  }));
});
