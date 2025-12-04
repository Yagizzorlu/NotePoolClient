import { Component, Input, OnInit } from '@angular/core';
import { ReactionTargetType, ReactionType } from '../../../../contracts/reaction-request';
import { CommentService } from '../../../../services/common/models/comment.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../../services/ui/custom-toastr.service';
import { DeleteDialogComponent, DeleteState } from '../../../../dialogs/delete-dialog/delete-dialog.component';
import { UpdateCommentDialogComponent } from '../../../../dialogs/update-comment-dialog/update-comment-dialog.component';
import { CommentDto } from '../../../../contracts/comment-dto';
import { AuthService } from '../../../../services/common/auth.service';
import { DialogService } from '../../../../services/common/dialog.service';

@Component({
  selector: 'app-comment-thread',
  templateUrl: './comment-thread.component.html',
  styleUrls: ['./comment-thread.component.scss']
})
export class CommentThreadComponent implements OnInit {

  @Input() noteId!: string;
  
  comments: CommentDto[] = [];
  totalComments: number = 0;
  isLoading: boolean = true;
  
  // Yeni yorum inputu için model
  newCommentText: string = '';
  
  // Cevap verme durumu (Reply Mode)
  // Hangi yoruma cevap yazılıyor? (Comment ID)
  activeReplyId: string | null = null;
  replyText: string = '';

  // Reaction Enum
  targetTypeComment = ReactionTargetType.Comment;

  constructor(
    private commentService: CommentService,
    public authService: AuthService,
    private toastr: CustomToastrService,
    private dialogService: DialogService
  ) {}

  ngOnInit(): void {
    this.loadComments();
  }

  async loadComments() {
    this.isLoading = true;
    try {
      // Sadece ana yorumları (ParentId = null) çekiyoruz.
      // Alt yorumları "Cevapları Gör" diyince çekeceğiz veya 
      // eğer backend hepsini ağaç olarak dönüyorsa direkt basacağız.
      // Bizim backend yapımızda "Replies" property'si yoktu, ayrı çekiyorduk.
      // Ancak UX için ana yorumları çekip, her yorumun altında "Cevapları Yükle" butonu koymak en performanslısıdır.
      
      const response = await this.commentService.getAll(0, 20, this.noteId, undefined, undefined); // ParentId undefined = Ana yorumlar
      this.comments = response.comments;
      this.totalComments = response.totalCount;
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  // --- ACTIONS ---

  async submitComment(parentId?: string) {
    const content = parentId ? this.replyText : this.newCommentText;
    
    if (!content.trim()) return;

    try {
      await this.commentService.create({
        noteId: this.noteId,
        content: content,
        parentId: parentId
      });

      this.toastr.message("Yorum gönderildi.", "Başarılı", { messageType: ToastrMessageType.Success, position: ToastrPosition.BottomRight });
      
      // Temizlik
      if (parentId) {
        this.activeReplyId = null;
        this.replyText = '';
        // Alt yorumu UI'a eklemek için o yorumun cevaplarını yeniden yüklemek gerekir
        // Şimdilik basitçe ana listeyi yenileyelim (Senior çözümde sadece o dalı yenileriz)
        this.loadComments(); 
      } else {
        this.newCommentText = '';
        this.loadComments();
      }

    } catch (error) {
      // Hata interceptor'da
    }
  }

  toggleReplyBox(commentId: string) {
    if (this.activeReplyId === commentId) {
      this.activeReplyId = null; // Kapat
    } else {
      this.activeReplyId = commentId; // Aç
      this.replyText = ''; // Temizle
    }
  }

  async loadReplies(comment: CommentDto) {
    // Eğer cevaplar zaten yüklendiyse (cache), tekrar çekme
    if (comment.replies && comment.replies.length > 0) {
      comment.isViewingReplies = !comment.isViewingReplies;
      return;
    }

    try {
      const response = await this.commentService.getAll(0, 100, this.noteId, undefined, comment.id);
      comment.replies = response.comments;
      comment.isViewingReplies = true;
    } catch (error) {
      // Hata
    }
  }

  deleteComment(commentId: string) {
    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: { title: "Yorumu Sil", message: "Bu yorumu silmek istediğinize emin misiniz?" },
      afterClosed: async (result) => {
        if (result === DeleteState.Yes) {
          await this.commentService.remove(commentId);
          this.toastr.message("Yorum silindi.", "Info", { messageType: ToastrMessageType.Info, position: ToastrPosition.BottomRight });
          this.loadComments(); // Listeyi yenile
        }
      }
    });
  }

  updateComment(comment: CommentDto) {
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

  // Mevcut kullanıcının reaction'ını döndür
  getCurrentUserReaction(comment: CommentDto): ReactionType | null {
    if (comment.isLiked) {
      return ReactionType.Like;
    } else if (comment.isDisliked) {
      return ReactionType.Dislike;
    }
    return null;
  }
}
