import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'secondsToTime',
    pure: false
})
export class SecondsToTimePipe implements PipeTransform {

    transform(value: any, args?: any): any {
        const hours: number = Math.floor(value / 3600);
        const minutes: number = Math.floor((value - hours * 3600) / 60);
        const seconds: number = (value - hours * 3600 - minutes * 60);
        return hours.toString() + ':' +
            minutes.toString().padStart(2, '0') + ':' +
            seconds.toString().padStart(2, '0');
    }

}
