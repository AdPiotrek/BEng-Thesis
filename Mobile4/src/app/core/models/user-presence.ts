import { User } from './user';

export interface UserPresence {
  _id?: String;
  startTime: Date | number;
  endTime: Date | number;
  user: String | User;
  plannedEnding?: Date,
  isActive?: Boolean
}
