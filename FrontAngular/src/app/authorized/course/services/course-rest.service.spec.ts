import { TestBed, inject } from '@angular/core/testing';

import { CourseRestService } from './course-rest.service';

describe('CourseRestService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CourseRestService]
    });
  });

  it('should be created', inject([CourseRestService], (service: CourseRestService) => {
    expect(service).toBeTruthy();
  }));
});
