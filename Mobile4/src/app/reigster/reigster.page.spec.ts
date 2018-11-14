import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReigsterPage } from './reigster.page';

describe('ReigsterPage', () => {
  let component: ReigsterPage;
  let fixture: ComponentFixture<ReigsterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReigsterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReigsterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
