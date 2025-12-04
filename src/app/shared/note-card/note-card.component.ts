import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NoteListDto } from '../../contracts/note-list-dto';
import { ReactionTargetType, ReactionType } from '../../contracts/reaction-request';
import { BookmarkService } from '../../services/common/models/bookmark.service';
import { NoteDownloadService } from '../../services/common/models/note-download.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/custom-toastr.service';
import { AuthService } from '../../services/common/auth.service';
import { DialogService } from '../../services/common/dialog.service';
import { DeleteDialogComponent, DeleteState } from '../../dialogs/delete-dialog/delete-dialog.component';
import { NoteService } from '../../services/common/models/note.service';

@Component({
  selector: 'app-note-card',
  templateUrl: './note-card.component.html',
  styleUrls: ['./note-card.component.scss']
})
export class NoteCardComponent implements OnInit {
  @Input() note!: NoteListDto;

  // Reaction button için gerekli tip
  targetTypeNote = ReactionTargetType.Note;
  
  // UI State
  isDownloading: boolean = false;
  isMenuOpen: boolean = false;

  constructor(
    private router: Router,
    private bookmarkService: BookmarkService,
    private downloadService: NoteDownloadService,
    private toastr: CustomToastrService,
    public authService: AuthService,
    private dialogService: DialogService,
    private noteService: NoteService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {}

  // 1. Detaya Git (Ana Tıklama)
  goToDetail(): void {
    this.router.navigate(['/notes', this.note.id]);
  }

  // 1.5. Yorumlara Git
  goToComments(event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/notes', this.note.id], { fragment: 'comments' });
  }

  // 2. Profile Git (İç Tıklama)
  goToProfile(event: Event): void {
    event.stopPropagation(); // Karta tıklamayı engelle
    this.router.navigate(['/profile', this.note.userId]);
  }

  // 3. Bookmark Toggle (Servis Bağlantısı)
  async toggleBookmark(event: Event): Promise<void> {
    event.stopPropagation();
    
    // Optimistic UI (Anında görüntü değişimi)
    const oldState = this.note.isBookmarked;
    this.note.isBookmarked = !this.note.isBookmarked;
    
    // Sayaç güncelleme (Görsel olarak)
    if (this.note.isBookmarked) this.note.bookmarkCount++;
    else this.note.bookmarkCount--;

    try {
      await this.bookmarkService.toggleBookmark({ noteId: this.note.id });
    } catch (error) {
      // Hata olursa geri al
      this.note.isBookmarked = oldState;
      if (oldState) this.note.bookmarkCount++; else this.note.bookmarkCount--;
      this.toastr.message("İşlem başarısız", "Hata", { messageType: ToastrMessageType.Error, position: ToastrPosition.BottomRight });
    }
  }

  // 4. Hızlı İndir (Quick Download)
  async download(event: Event): Promise<void> {
    event.stopPropagation();
    if (this.isDownloading) return;

    try {
      this.isDownloading = true;
      this.toastr.message("İndirme başlatılıyor...", "Bilgi", { messageType: ToastrMessageType.Info, position: ToastrPosition.BottomRight });
      
      await this.downloadService.downloadNote(this.note.id); // Bu servisi sonra yazacağız
      
      this.note.downloadCount++; // Sayacı artır
      this.note.isDownloaded = true; // İkonu boya
    } catch (error) {
      this.toastr.message("İndirme başarısız", "Hata", { messageType: ToastrMessageType.Error, position: ToastrPosition.BottomRight });
    } finally {
      this.isDownloading = false;
    }
  }

  // 5. Menü Toggle
  toggleMenu(event: Event): void {
    event.stopPropagation();
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  // Click Outside (Dışarı tıklayınca kapat)
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isMenuOpen && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.closeMenu();
    }
  }

  // 6. Notu Sil
  deleteNote(event: Event): void {
    event.stopPropagation();
    this.closeMenu();
    
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: { title: "Notu Sil", message: "Bu notu silmek istediğinize emin misiniz?" },
      afterClosed: async (result) => {
        if (result === DeleteState.Yes) {
          try {
            await this.noteService.remove(this.note.id);
            this.toastr.message("Not silindi.", "Başarılı", { messageType: ToastrMessageType.Success, position: ToastrPosition.BottomRight });
            // Sayfayı yenile veya parent component'e event gönder
            window.location.reload();
          } catch (error) {
            // Hata interceptor'da
          }
        }
      }
    });
  }

  // 7. Notu Güncelle
  updateNote(event: Event): void {
    event.stopPropagation();
    this.closeMenu();
    this.router.navigate(['/note-upload'], { queryParams: { id: this.note.id } });
  }

  // Kullanıcının kendi notu mu?
  get isOwner(): boolean {
    return this.note.userId === this.authService.currentUserId;
  }

  // Mevcut kullanıcının reaction'ını döndür
  getCurrentUserReaction(): ReactionType | null {
    if (this.note.isLiked) {
      return ReactionType.Like;
    } else if (this.note.isDisliked) {
      return ReactionType.Dislike;
    }
    return null;
  }
}


