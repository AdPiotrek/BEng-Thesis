import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPresenceListComponent } from './user-presence-list.component';

describe('UserPresenceListComponent', () => {
  let component: UserPresenceListComponent;
  let fixture: ComponentFixture<UserPresenceListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPresenceListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPresenceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
