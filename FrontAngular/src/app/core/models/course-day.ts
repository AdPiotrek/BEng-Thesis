import { User } from './user';

export interface CourseDay {
  startTime: Date | number;
  endTime: Date | number;
  partsCount: number;
  presentUsers?: User[]
}
