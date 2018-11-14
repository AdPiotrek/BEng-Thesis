import { Pipe, PipeTransform } from '@angular/core';
import {DatePipe} from '@angular/common';

@Pipe({
  name: 'courseDay'
})
export class CourseDayPipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {

  }
  transform(value: any, args?: any): any {
    return `${this.datePipe.transform(value.startTime, 'mediumDate')}: ${this.datePipe.transform(value.startTime, 'shortTime')} -  ${this.datePipe.transform(value.endTime)}`
  }

}
