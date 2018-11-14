import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TogglePresenceComponent } from './toggle-presence.component';

describe('TogglePresenceComponent', () => {
  let component: TogglePresenceComponent;
  let fixture: ComponentFixture<TogglePresenceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TogglePresenceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TogglePresenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
