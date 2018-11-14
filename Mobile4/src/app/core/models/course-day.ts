import { User } from './user';

export interface CourseDay {
  startTime:  number| Date;
  endTime: number | Date;
  partsCount: number;
  presentUsers?: User[]
}
