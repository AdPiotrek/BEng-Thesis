import { TestBed, inject } from '@angular/core/testing';

import { InstructorRestService } from './instructor-rest.service';

describe('InstructorRestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InstructorRestService]
    });
  });

  it('should be created', inject([InstructorRestService], (service: InstructorRestService) => {
    expect(service).toBeTruthy();
  }));
});
