import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner'; // LoadingInterceptor var ama manuel kontrol gerekirse diye import
import { NoteListDto } from '../../../contracts/note-list-dto';
import { NoteService } from '../../../services/common/models/note.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../services/ui/custom-toastr.service';

@Component({
  selector: 'app-bookmarks-page',
  templateUrl: './bookmarks.component.html',
  styleUrls: ['./bookmarks.component.scss']
})
export class BookmarksComponent implements OnInit {

  notes: NoteListDto[] = [];
  totalCount: number = 0;
  
  currentPage: number = 0;
  pageSize: number = 12; // Grid için ideal sayı (3x4 veya 4x3)
  
  isLoading: boolean = true;

  constructor(
    private noteService: NoteService,
    private toastr: CustomToastrService
  ) {}

  ngOnInit(): void {
    this.loadBookmarks();
  }

  async loadBookmarks() {
    this.isLoading = true;
    try {
      // Backend'de eklediğimiz 'isBookmarkedByCurrentUser' filtresini kullanıyoruz
      const response = await this.noteService.getAll(
        this.currentPage, 
        this.pageSize, 
        { isBookmarked: true }
      );

      this.notes = response.notes;
      this.totalCount = response.totalCount;

    } catch (error) {
      this.toastr.message("Kaydedilen notlar yüklenirken bir hata oluştu.", "Hata", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.BottomRight
      });
    } finally {
      // Skeleton loader'ın görünebilmesi için çok hızlı cevap gelse bile minik bir gecikme hissi (Opsiyonel)
      // setTimeout(() => this.isLoading = false, 300); 
      this.isLoading = false;
    }
  }

  onPageChanged(page: number) {
    this.currentPage = page;
    this.loadBookmarks();
    // Sayfa değişince yukarı kaydır (Shared Layout yapıyor ama garanti olsun)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

