import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'salary',
  standalone: true
})
export class SalaryPipe implements PipeTransform {

  transform(value: number | string, showSuffix: boolean = true): string {
    if (value == null) return '';

    // Convertir en nombre et formatter avec l’espace pour les milliers
    const formattedValue = new Intl.NumberFormat('fr-MG').format(Number(value));

    return showSuffix ? `${formattedValue} Ar` : formattedValue;
  }

}
