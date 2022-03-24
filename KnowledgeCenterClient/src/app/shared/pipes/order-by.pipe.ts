import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'orderByString'
})
export class OrderByStringPipe implements PipeTransform {

  transform(array: any, field: string): any[] {
    if (!Array.isArray(array)) {
      return;
    }
    array.sort((a: any, b: any) => {
      if (!a[field] || !b[field]) {
        return 0;
      }
      if (a[field].toUpperCase() < b[field].toUpperCase()) {
        return -1;
      } else if (a[field].toUpperCase() > b[field].toUpperCase()) {
        return 1;
      } else {
        return 0;
      }
    });
    return array;
  }

}
