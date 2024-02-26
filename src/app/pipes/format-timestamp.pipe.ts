import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTimestamp'
})
export class FormatTimestampPipe implements PipeTransform {
  transform(value: number, ...args: unknown[]): unknown {
    const date = new Date(parseInt(value.toString()));
    const formatedDate = date.toLocaleDateString('pl-PL');
    return formatedDate;
  }
}
