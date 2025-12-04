import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NoteDownloadDto } from '../../../../../contracts/note-download-dto';
import { CommentDto } from '../../../../../contracts/comment-dto';
import { NoteService } from '../../../../../services/common/models/note.service';
import { NoteDownloadService } from '../../../../../services/common/models/note-download.service';
import { CommentService } from '../../../../../services/common/models/comment.service';
import { NoteListDto } from '../../../../../contracts/note-list-dto';

// Hangi tip veriyi göstereceğimizi belirleyen Enum (veya string union)
export type ActivityType = 'notes' | 'downloads' | 'comments';

@Component({
  selector: 'app-activity-list',
  templateUrl: './activity-list.component.html',
  styleUrls: ['./activity-list.component.scss']
})
export class ActivityListComponent implements OnChanges {

  @Input() userId!: string;
  @Input() type: ActivityType = 'notes';
  @Input() isOwner: boolean = false;

  // Veri Havuzları (Tek bir dizi yerine tip güvenliği için ayırdım)
  notes: NoteListDto[] = [];
  downloads: NoteDownloadDto[] = [];
  comments: CommentDto[] = [];

  isLoading: boolean = true;
  totalCount: number = 0;
  page: number = 0;
  pageSize: number = 9;

  constructor(
    private noteService: NoteService,
    private downloadService: NoteDownloadService,
    private commentService: CommentService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Tab değiştiğinde veya User değiştiğinde yeniden yükle
    if (changes['type'] || changes['userId']) {
      this.page = 0;
      this.notes = [];
      this.downloads = [];
      this.comments = [];
      this.loadData();
    }
  }

  async loadData() {
    this.isLoading = true;
    try {
      switch (this.type) {
        case 'notes':
          // Kullanıcının yüklediği notlar
          const noteRes = await this.noteService.getAll(this.page, this.pageSize, { userId: this.userId });
          this.notes = noteRes.notes;
          this.totalCount = noteRes.totalCount;
          break;

        case 'downloads':
          // Kullanıcının indirdiği notlar (Sadece sahibi veya admin görebilir genelde, ama burada public yaptık)
          const downloadRes = await this.downloadService.getAll(this.page, this.pageSize, this.userId);
          this.downloads = downloadRes.downloads;
          this.totalCount = downloadRes.totalCount;
          break;

        case 'comments':
          // Kullanıcının yaptığı yorumlar
          const commentRes = await this.commentService.getAll(this.page, this.pageSize, undefined, this.userId);
          this.comments = commentRes.comments;
          this.totalCount = commentRes.totalCount;
          break;
      }
    } catch (error) {
      console.error("Veri yüklenemedi", error);
    } finally {
      // Skeleton'ın tadını çıkarmak için minik gecikme (Opsiyonel)
      setTimeout(() => this.isLoading = false, 300);
    }
  }

  onPageChange(page: number) {
    this.page = page;
    this.loadData();
    // Hafif yukarı scroll (Tam tepeye değil, listenin başına)
    document.querySelector('app-activity-list')?.scrollIntoView({ behavior: 'smooth' });
  }
}

