import { CourseRoutingModule } from './course-routing.module';

describe('CourseRoutingModule', () => {
  let courseRoutingModule: CourseRoutingModule;

  beforeEach(() => {
    courseRoutingModule = new CourseRoutingModule();
  });

  it('should create an instance', () => {
    expect(courseRoutingModule).toBeTruthy();
  });
});
