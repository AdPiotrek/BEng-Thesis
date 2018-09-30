import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPresenceManagementComponent } from './user-presence-management.component';

describe('UserPresenceManagementComponent', () => {
  let component: UserPresenceManagementComponent;
  let fixture: ComponentFixture<UserPresenceManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPresenceManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPresenceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
