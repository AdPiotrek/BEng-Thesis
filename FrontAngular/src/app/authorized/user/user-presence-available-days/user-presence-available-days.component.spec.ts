import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPresenceAvailableDaysComponent } from './user-presence-available-days.component';

describe('UserPresenceAvailableDaysComponent', () => {
  let component: UserPresenceAvailableDaysComponent;
  let fixture: ComponentFixture<UserPresenceAvailableDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPresenceAvailableDaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPresenceAvailableDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
