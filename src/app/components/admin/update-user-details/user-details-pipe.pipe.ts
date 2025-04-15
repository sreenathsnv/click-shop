import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  standalone: false
})
export class UserDetailsPipePipe implements PipeTransform {

  transform(value: any[], searchQuery: string): any[] {
    if (!value || !searchQuery) return value;
    return value.filter(user =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

}
