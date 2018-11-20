import { User } from './user';

export interface CourseDay {
  _id?;
  startTime:  number| Date;
  endTime: number | Date;
  partsCount: number;
  presentUsers?: User[]
}
