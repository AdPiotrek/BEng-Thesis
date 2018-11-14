import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivePresenceComponent } from './active-presence.component';

describe('ActivePresenceComponent', () => {
  let component: ActivePresenceComponent;
  let fixture: ComponentFixture<ActivePresenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ActivePresenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivePresenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
