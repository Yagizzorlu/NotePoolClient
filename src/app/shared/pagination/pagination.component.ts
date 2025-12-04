import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {
  
  // --- Girdiler ---
  @Input() totalItems: number = 0;
  @Input() itemsPerPage: number = 10;
  @Input() currentPage: number = 0; // Backend 0-based sayfalama kullanıyorsa 0, yoksa 1. Biz 0 varsaydık.

  // --- Çıktılar ---
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  // --- Hesaplanan Değerler ---
  totalPages: number = 0;
  pages: (number | string)[] = []; // Sayılar ve '...' (ellipsis) içerecek

  ngOnChanges(changes: SimpleChanges): void {
    // Herhangi bir input değiştiğinde (özellikle filtreleme yapıldığında totalItems değişir)
    this.calculatePages();
  }

  onPageChange(page: number | string): void {
    if (page === '...') return; // Noktalara tıklanırsa işlem yapma
    
    const pageNumber = Number(page);
    
    // Sınır kontrolü ve gereksiz emit'i önleme
    if (pageNumber >= 0 && pageNumber < this.totalPages && pageNumber !== this.currentPage) {
      this.pageChange.emit(pageNumber);
    }
  }

  private calculatePages() {
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    this.pages = this.generatePageArray();
  }

  // Senior Logic: Akıllı Sayfa Dizisi Oluşturucu (Windowing Algorithm)
  private generatePageArray(): (number | string)[] {
    // Eğer toplam sayfa azsa hepsini göster (Örn: 7 sayfa)
    if (this.totalPages <= 7) {
      return Array.from({ length: this.totalPages }, (_, i) => i);
    }

    // Eğer çok sayfa varsa, başta, sonda ve ortada göster, aralara ... koy
    const visiblePages: (number | string)[] = [];
    const current = this.currentPage;
    const last = this.totalPages - 1;

    // Her zaman ilk sayfayı ekle
    visiblePages.push(0);

    // Başlangıçtaki noktalar (Eğer 3. sayfadan ilerideysek)
    if (current > 2) {
      visiblePages.push('...');
    }

    // Orta Blok (Mevcut sayfanın solu ve sağı)
    const start = Math.max(1, current - 1);
    const end = Math.min(last - 1, current + 1);

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    // Sondaki noktalar (Eğer sondan 3. sayfadan gerideysek)
    if (current < last - 2) {
      visiblePages.push('...');
    }

    // Her zaman son sayfayı ekle
    if (this.totalPages > 1) {
      visiblePages.push(last);
    }

    return visiblePages;
  }
}


