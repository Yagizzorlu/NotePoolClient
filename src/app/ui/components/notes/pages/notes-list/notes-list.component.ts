import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { DEFAULT_NOTE_FILTER, NoteFilter, NoteSortOption } from '../../models/note-filter.model';
import { NoteService } from '../../../../../services/common/models/note.service';
import { FilterState } from '../../filter-panel/filter-panel.component';
import { NoteListDto } from '../../../../../contracts/note-list-dto';


@Component({
  selector: 'app-notes-list',
  templateUrl: './notes-list.component.html',
  styleUrls: ['./notes-list.component.scss']
})
export class NotesListComponent implements OnInit {

  // Data
  notes: NoteListDto[] = [];
  totalCount: number = 0;
  isLoading: boolean = true;

  // STATE MANAGEMENT (Tek Obje)
  // Tüm filtre, sayfa ve sıralama bilgisi burada tutulur.
  filter: NoteFilter = { ...DEFAULT_NOTE_FILTER };

  constructor(
    private noteService: NoteService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    // URL'deki parametreleri Model'e eşle (Deep Linking)
    this.route.queryParams.subscribe(params => {
      this.filter = {
        ...DEFAULT_NOTE_FILTER, // Önce varsayılanları al
        ...params, // URL'den gelenleri üzerine yaz
        
        // Sayısal değerleri manuel parse et (URL string döner)
        page: params['page'] ? Number(params['page']) : 0,
        size: params['size'] ? Number(params['size']) : 12,
        
        // Eğer enum veya boolean varsa cast etmemiz gerekebilir,
        // şimdilik string uyumlu olduğu için spread operator yeterli.
        institutionId: params['institutionId'] || undefined,
        departmentId: params['departmentId'] || undefined,
        courseId: params['courseId'] || undefined,
        searchTerm: params['searchTerm'] || '',
        sortBy: params['sortBy'] || 'CreatedDate'
      };

      this.loadNotes();
    });
  }

  async loadNotes() {
    this.isLoading = true;
    try {
      // Servis artık dağınık parametre değil, obje mantığıyla çalışıyor
      const response = await this.noteService.getAll(
        this.filter.page,
        this.filter.size,
        this.filter // Filtre objesinin tamamını gönderiyoruz (spread gerekmez, servis içinde mapleniyor)
      );

      this.notes = response.notes;
      this.totalCount = response.totalCount;

    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  // --- EVENT HANDLERS ---

  // FilterPanel'den gelen değişiklik
  onFilterChange(filters: FilterState) {
    // Filtre değiştiğinde sayfayı başa al ve filtreleri güncelle
    this.updateUrl({ 
      ...filters, 
      page: 0 
    });
  }

  // SortBar'dan gelen değişiklik
  onSortChange(sort: NoteSortOption) {
    this.updateUrl({ 
      sortBy: sort, 
      page: 0 
    });
  }

  // Pagination'dan gelen değişiklik
  onPageChange(page: number) {
    this.updateUrl({ 
      page: page 
    });
  }

  get currentSortValue() {
  return this.filter.sortBy || 'CreatedDate';
}

  // URL GÜNCELLEME (State'in Tek Kaynağı URL'dir)
  private updateUrl(queryParams: Partial<NoteFilter>) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams, // Sadece değişenleri gönderiyoruz
      queryParamsHandling: 'merge' // Diğerlerini koru (Örn: searchTerm değiştiyse institutionId kalsın)
    });
  }
}


