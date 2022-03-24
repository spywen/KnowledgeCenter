import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {

  transform(value: string, size: number = 20, trail: string = '...'): string {
    let result = value || '';

    size = Math.abs(size);
    if (value != null && value.length > size) {
      result = value.slice(0, size) + trail;
    }
    return result;
  }
}
