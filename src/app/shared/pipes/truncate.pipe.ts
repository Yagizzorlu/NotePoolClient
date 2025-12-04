import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  pure: true // Performans için statik çalışır
})
export class TruncatePipe implements PipeTransform {

  /**
   * Metni belirli bir karakter sayısına göre kısaltır.
   * @param value Kısaltılacak metin
   * @param limit Karakter limiti (Varsayılan: 20)
   * @param completeWords Kelimeleri bölme? (True ise kelime bitiminden keser)
   * @param ellipsis Sonuna eklenecek işaret (Varsayılan: '...')
   */
  transform(value: string | undefined | null, limit: number = 20, completeWords: boolean = false, ellipsis: string = '...'): string {
    
    // 1. Defensive Check
    if (!value) return '';
    
    // 2. Limit Kontrolü
    if (value.length <= limit) {
      return value;
    }

    // 3. Kelime Bütünlüğü Modu (Opsiyonel)
    if (completeWords) {
      // Limite kadar al, ama son boşluğa kadar geri git
      limit = value.substring(0, limit).lastIndexOf(' ');
    }

    // 4. Kesme ve Birleştirme
    return value.substring(0, limit) + ellipsis;
  }

}

