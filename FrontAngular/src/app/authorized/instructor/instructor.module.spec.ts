import { InstructorModule } from './instructor.module';

describe('InstructorModule', () => {
  let instructorModule: InstructorModule;

  beforeEach(() => {
    instructorModule = new InstructorModule();
  });

  it('should create an instance', () => {
    expect(instructorModule).toBeTruthy();
  });
});
