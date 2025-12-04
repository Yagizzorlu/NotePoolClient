import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  pure: true // Performans için true. (False yaparsan her saniye günceller ama işlemciyi yorar)
})
export class TimeAgoPipe implements PipeTransform {

  transform(value: string | Date | undefined): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Gelecek tarih kontrolü (Saat farkı vs. yüzünden eksi çıkarsa)
    if (seconds < 0) return 'Az önce';

    // Zaman Aralıkları
    const intervals: { [key: string]: number } = {
      'yıl': 31536000,
      'ay': 2592000,
      'hafta': 604800,
      'gün': 86400,
      'saat': 3600,
      'dakika': 60,
      'saniye': 1
    };

    let counter;

    // 1. Hafta kontrolü (7 günden eskiyse tam tarih göster) - SENIOR UX
    // 6 ay önce "3 gün önce" yazması saçma durur, tarih görmek isteriz.
    if (seconds > 604800) { // 7 gün
        return this.formatDate(date);
    }

    // 2. Göreceli Zaman Hesaplama
    for (const i in intervals) {
      counter = Math.floor(seconds / intervals[i]);
      
      if (counter > 0) {
        if (counter === 1) {
          return `1 ${i} önce`;
        } else {
          return `${counter} ${i} önce`;
        }
      }
    }

    return 'Az önce';
  }

  // Yardımcı: Tam tarih formatı (Örn: 14 Kas 2024)
  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('tr-TR', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  }

}

