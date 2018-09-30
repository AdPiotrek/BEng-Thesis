import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignToCourseDialogComponent } from './sign-to-course-dialog.component';

describe('SignToCourseDialogComponent', () => {
  let component: SignToCourseDialogComponent;
  let fixture: ComponentFixture<SignToCourseDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignToCourseDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignToCourseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
