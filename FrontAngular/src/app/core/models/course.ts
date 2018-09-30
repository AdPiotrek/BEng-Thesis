import {CourseDay} from './course-day';

export interface Course {
  _id: string;
  name: string;
  key: string;
  startDate:  number | string ;
  endDate: number | string;
  description: string;
  partsCount: string;
  lessonTime: string;
  breakTime: string;
  courseDays: Array<CourseDay>;
}
