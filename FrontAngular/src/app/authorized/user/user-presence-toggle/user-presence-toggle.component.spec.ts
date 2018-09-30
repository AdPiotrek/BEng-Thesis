import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPresenceToggleComponent } from './user-presence-toggle.component';

describe('UserPresenceToggleComponent', () => {
  let component: UserPresenceToggleComponent;
  let fixture: ComponentFixture<UserPresenceToggleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPresenceToggleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPresenceToggleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
