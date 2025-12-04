import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NoteDetail } from '../../../../../contracts/note-detail';
import { ReactionTargetType, ReactionType } from '../../../../../contracts/reaction-request';
import { NoteService } from '../../../../../services/common/models/note.service';
import { NoteDownloadService } from '../../../../../services/common/models/note-download.service';
import { BookmarkService } from '../../../../../services/common/models/bookmark.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../../../services/ui/custom-toastr.service';
import { SpinnerType } from '../../../../../base/base.component';

@Component({
  selector: 'app-note-detail',
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.scss']
})
export class NoteDetailComponent implements OnInit {

  note: NoteDetail | null = null;
  isLoading: boolean = true;
  isDownloading: boolean = false;

  // Backend Adresin (Bunu environment dosyasından çekmek daha iyidir ama şimdilik böyle çalışır)
  private readonly baseApiUrl = "https://localhost:7111/"; 

  targetTypeNote = ReactionTargetType.Note;
  reactionTypeLike = ReactionType.Like;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private noteService: NoteService,
    private downloadService: NoteDownloadService,
    private bookmarkService: BookmarkService,
    private toastr: CustomToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadNoteDetail(id);
      } else {
        this.router.navigate(['/notes']);
      }
    });
  }

  async loadNoteDetail(id: string) {
    this.isLoading = true;
    this.spinner.show(SpinnerType.BallScale);

    try {
      const viewedNotesKey = 'viewedNotes';
      const viewedNotes: string[] = JSON.parse(sessionStorage.getItem(viewedNotesKey) || '[]');
      
      if (!viewedNotes.includes(id)) {
        await this.noteService.incrementViewCount(id);
        viewedNotes.push(id);
        sessionStorage.setItem(viewedNotesKey, JSON.stringify(viewedNotes));
      }

      // Not detaylarını çek
      this.note = await this.noteService.getById(id);

      // --- DÜZELTME BURADA BAŞLIYOR ---
      // PDF Viewer'ın dosyayı bulabilmesi için path'in başına localhost:7111 ekliyoruz.
      if (this.note && this.note.files) {
        this.note.files.forEach(file => {
          // Eğer path zaten http ile başlamıyorsa (yani full link değilse)
          if (file.path && !file.path.startsWith('http')) {
            // Başındaki / işaretini temizle ki çift slash olmasın (//)
            const cleanPath = file.path.startsWith('/') ? file.path.substring(1) : file.path;
            
            // Yeni path: https://localhost:7111/note-files/dosya.pdf
            file.path = `${this.baseApiUrl}${cleanPath}`;
          }
        });
      }
      // --- DÜZELTME BİTTİ ---

    } catch (error) {
      this.toastr.message("Not bulunamadı veya erişim izniniz yok.", "Hata", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight
      });
    } finally {
      this.isLoading = false;
      this.spinner.hide(SpinnerType.BallScale);
    }
  }

  // --- ACTIONS ---

  async downloadNote() {
    if (!this.note || this.isDownloading) return;

    this.isDownloading = true;
    this.toastr.message("İndirme başlatılıyor...", "Bilgi", { messageType: ToastrMessageType.Info, position: ToastrPosition.BottomRight });

    try {
      // Servis üzerinden indirme (API Endpoint ile)
      await this.downloadService.downloadNote(this.note.id);
      
      this.note.downloadCount++;
      this.note.isDownloaded = true;
      
      this.toastr.message("İndirme tamamlandı.", "Başarılı", { messageType: ToastrMessageType.Success, position: ToastrPosition.BottomRight });
    } catch (error) {
      this.toastr.message("İndirme sırasında bir hata oluştu.", "Hata", { messageType: ToastrMessageType.Error, position: ToastrPosition.BottomRight });
    } finally {
      this.isDownloading = false;
    }
  }

  async toggleBookmark() {
    if (!this.note) return;

    const previousState = this.note.isBookmarked;
    this.note.isBookmarked = !this.note.isBookmarked;

    try {
      await this.bookmarkService.toggleBookmark({ noteId: this.note.id });
      
      const msg = this.note.isBookmarked ? "Not kaydedildi." : "Not kaydedilenlerden çıkarıldı.";
      this.toastr.message(msg, "Başarılı", { messageType: ToastrMessageType.Success, position: ToastrPosition.BottomRight });

    } catch (error) {
      this.note.isBookmarked = previousState;
      this.toastr.message("İşlem başarısız.", "Hata", { messageType: ToastrMessageType.Error, position: ToastrPosition.BottomRight });
    }
  }
}

