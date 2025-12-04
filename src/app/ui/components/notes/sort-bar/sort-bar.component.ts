import { Component, EventEmitter, Input, Output } from '@angular/core';

// Sıralama Seçenekleri (Backend Enum ile uyumlu stringler)
export type SortOption = 'CreatedDate' | 'ViewCount' | 'DownloadCount' | 'LikeCount' | 'CommentCount';

@Component({
  selector: 'app-sort-bar',
  templateUrl: './sort-bar.component.html',
  styleUrls: ['./sort-bar.component.scss']
})
export class SortBarComponent {
  
  @Input() totalCount: number = 0;
  @Input() currentSort: SortOption = 'CreatedDate';
  
  @Output() sortChange = new EventEmitter<SortOption>();

  // UI İçin Seçenek Listesi
  sortOptions: { value: SortOption, label: string, icon: string }[] = [
    { value: 'CreatedDate', label: 'En Yeniler', icon: 'fa-regular fa-clock' },
    { value: 'DownloadCount', label: 'Popüler', icon: 'fa-solid fa-download' },
    { value: 'LikeCount', label: 'Beğenilenler', icon: 'fa-regular fa-thumbs-up' },
    { value: 'ViewCount', label: 'Çok Okunan', icon: 'fa-regular fa-eye' },
    { value: 'CommentCount', label: 'Tartışılan', icon: 'fa-regular fa-comments' }
  ];

  selectSort(option: SortOption) {
    if (this.currentSort === option) return; // Zaten seçili
    this.currentSort = option;
    this.sortChange.emit(option);
  }
}
