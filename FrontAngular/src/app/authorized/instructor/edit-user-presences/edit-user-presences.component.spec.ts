import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserPresencesComponent } from './edit-user-presences.component';

describe('EditUserPresencesComponent', () => {
  let component: EditUserPresencesComponent;
  let fixture: ComponentFixture<EditUserPresencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditUserPresencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserPresencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
