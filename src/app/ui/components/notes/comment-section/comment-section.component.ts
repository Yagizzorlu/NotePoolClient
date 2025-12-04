import { Component, Input, OnInit } from '@angular/core';
import { CommentDto } from '../../../../contracts/comment-dto';
import { CommentService } from '../../../../services/common/models/comment.service';
import { AuthService } from '../../../../services/common/auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../../services/ui/custom-toastr.service';
import { DialogService } from '../../../../services/common/dialog.service';
import { DeleteDialogComponent, DeleteState } from '../../../../dialogs/delete-dialog/delete-dialog.component';
import { UpdateCommentDialogComponent } from '../../../../dialogs/update-comment-dialog/update-comment-dialog.component';

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.scss']
})
export class CommentSectionComponent implements OnInit {

  @Input() noteId!: string;
  
  comments: CommentDto[] = [];
  totalComments: number = 0;
  isLoading: boolean = true;
  
  // Yeni yorum inputu
  newCommentText: string = '';

  constructor(
    private commentService: CommentService,
    public authService: AuthService,
    private toastr: CustomToastrService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    if (this.noteId) {
      this.loadComments();
    }
  }

  // --- LOAD DATA ---
  async loadComments() {
    this.isLoading = true;
    try {
      // Sadece ana yorumları (ParentId = null) çekiyoruz.
      const response = await this.commentService.getAll(0, 50, this.noteId, undefined, undefined);
      this.comments = response.comments;
      this.totalComments = response.totalCount;
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  // --- ACTIONS (Create) ---
  // Hem ana yorum hem de alt yorum (reply) ekleme işlemini burası yönetir
  async submitComment(content: string, parentId?: string) {
    if (!content.trim()) return;

    try {
      await this.commentService.create({
        noteId: this.noteId,
        content: content,
        parentId: parentId
      });

      this.toastr.message("Yorum gönderildi.", "Başarılı", { messageType: ToastrMessageType.Success, position: ToastrPosition.BottomRight });
      
      if (!parentId) {
        // Ana yorum eklendiyse inputu temizle ve listeyi yenile
        this.newCommentText = '';
        this.loadComments(); 
      } else {
        // Alt yorum eklendiyse, parent comment'in replies'ını yeniden yükle
        await this.loadRepliesForComment(parentId);
      }

    } catch (error) {
      // Hata interceptor'da
    }
  }

  // Parent comment'in alt yorumlarını yükle
  async loadRepliesForComment(parentId: string) {
    try {
      const response = await this.commentService.getAll(0, 100, this.noteId, undefined, parentId);
      
      // Parent comment'i bul ve replies'ını güncelle
      const parentComment = this.findCommentById(this.comments, parentId);
      if (parentComment) {
        parentComment.replies = response.comments;
        parentComment.replyCount = response.totalCount;
        parentComment.isViewingReplies = true; // Otomatik olarak göster
      }
    } catch (error) {
      console.error("Replies yüklenirken hata:", error);
      // Hata olursa tüm listeyi yenile
      this.loadComments();
    }
  }

  // Recursive olarak comment'i bul
  private findCommentById(comments: CommentDto[], id: string): CommentDto | null {
    for (const comment of comments) {
      if (comment.id === id) {
        return comment;
      }
      if (comment.replies && comment.replies.length > 0) {
        const found = this.findCommentById(comment.replies, id);
        if (found) return found;
      }
    }
    return null;
  }

  // --- ACTIONS (Delete) ---
  // CommentItem'dan gelen silme isteğini yakalar
  onDeleteClicked(commentId: string) {
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: { 
        title: "Yorumu Sil", 
        message: "Bu yorumu silmek istediğinize emin misiniz?" 
      },
      afterClosed: async (result) => {
        if (result === DeleteState.Yes) {
          try {
            await this.commentService.remove(commentId);
            this.toastr.message("Yorum silindi.", "Bilgi", { messageType: ToastrMessageType.Info, position: ToastrPosition.BottomRight });
            
            // Listeyi güncelle (Server'dan çekmeden local filtreleme - Performans)
            this.comments = this.comments.filter(c => c.id !== commentId);
            this.totalComments--;
            
            // Eğer alt yorum silindiyse (recursive olduğu için) yine de loadComments çağırmak en garantisi olabilir.
            // Şimdilik reload yapalım:
            this.loadComments(); 

          } catch (error) {
             // Hata
          }
        }
      }
    });
  }

  // CommentItem'dan gelen cevaplama isteğini yakalar
  onReplySubmitted(event: { parentId: string, content: string }) {
    this.submitComment(event.content, event.parentId);
  }

  // CommentItem'dan gelen alt yorumları yükleme isteğini yakalar
  async onLoadRepliesClicked(parentId: string) {
    await this.loadRepliesForComment(parentId);
  }

  // CommentItem'dan gelen güncelleme isteğini yakalar
  onUpdateClicked(comment: CommentDto) {
    this.dialogService.openDialog({
      componentType: UpdateCommentDialogComponent,
      data: { currentContent: comment.content },
      afterClosed: async (result) => {
        if (result && result.trim()) {
          try {
            await this.commentService.update({
              id: comment.id,
              content: result
            });
            this.toastr.message("Yorum güncellendi.", "Başarılı", { messageType: ToastrMessageType.Success, position: ToastrPosition.BottomRight });
            this.loadComments(); // Listeyi yenile
          } catch (error) {
            // Hata interceptor'da
          }
        }
      }
    });
  }
}

