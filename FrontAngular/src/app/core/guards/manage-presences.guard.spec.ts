import { TestBed, async, inject } from '@angular/core/testing';

import { ManagePresencesGuard } from './manage-presences.guard';

describe('ManagePresencesGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ManagePresencesGuard]
    });
  });

  it('should ...', inject([ManagePresencesGuard], (guard: ManagePresencesGuard) => {
    expect(guard).toBeTruthy();
  }));
});
