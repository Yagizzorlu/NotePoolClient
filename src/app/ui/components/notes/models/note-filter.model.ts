// Sıralama Seçenekleri (Backend Enum ile uyumlu)
export type NoteSortOption = 'CreatedDate' | 'ViewCount' | 'DownloadCount' | 'LikeCount' | 'CommentCount';
export type SortDirection = 'asc' | 'desc';

export interface NoteFilter {
  // Sayfalama
  page: number;
  size: number;

  // Arama
  searchTerm?: string;

  // Kategorik Filtreler
  institutionId?: string;
  departmentId?: string;
  courseId?: string;
  userId?: string; // "Kullanıcının Notları" sayfası için

  // Durum Filtreleri
  isBookmarked?: boolean; // "Kaydettiklerim" sayfası için

  // Sıralama
  sortBy?: NoteSortOption;
  sortOrder?: SortDirection;
}

// Başlangıç Değerleri (Default State)
export const DEFAULT_NOTE_FILTER: NoteFilter = {
  page: 0,
  size: 12,
  sortBy: 'CreatedDate',
  sortOrder: 'desc'
};