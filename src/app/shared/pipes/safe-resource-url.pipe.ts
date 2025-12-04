import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Pipe({
  name: 'safeResourceUrl'
})
export class SafeResourceUrlPipe implements PipeTransform {

  // DomSanitizer: Angular'ın güvenlik ve temizleme servisi
  constructor(private readonly sanitizer: DomSanitizer) {}

  transform(url: string | undefined | null): SafeResourceUrl {
    // 1. Defensive Check (Boş gelirse patlamasın)
    if (!url) {
      return '';
    }

    // 2. Bypass Security
    // Gelen string URL'i, Angular'ın güvenli kabul ettiği "SafeResourceUrl" tipine çevirir.
    // DİKKAT: Bunu sadece güvendiğiniz kaynaklar (kendi Storage URL'iniz) için kullanın.
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}

