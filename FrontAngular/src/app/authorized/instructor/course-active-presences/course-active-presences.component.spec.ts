import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseActivePresencesComponent } from './course-active-presences.component';

describe('CourseActivePresencesComponent', () => {
  let component: CourseActivePresencesComponent;
  let fixture: ComponentFixture<CourseActivePresencesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CourseActivePresencesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CourseActivePresencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
