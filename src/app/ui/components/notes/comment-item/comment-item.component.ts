import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommentDto } from '../../../../contracts/comment-dto';
import { ReactionTargetType, ReactionType } from '../../../../contracts/reaction-request';
import { AuthService } from '../../../../services/common/auth.service';

@Component({
  selector: 'app-comment-item',
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent {

  // --- INPUTS ---
  @Input() comment!: CommentDto;
  @Input() depth: number = 0; // Derinlik kontrolü (Çizgi kalınlığı vs. için)

  // --- OUTPUTS (Event Bubble Up) ---
  // Bu component akılsızdır (Dumb). İşlemleri parent'a (Section) iletir.
  @Output() replyClicked = new EventEmitter<string>(); // ID döner
  @Output() deleteClicked = new EventEmitter<string>(); // ID döner
  @Output() updateClicked = new EventEmitter<CommentDto>(); // Comment döner
  @Output() replySubmitted = new EventEmitter<{ parentId: string, content: string }>();
  @Output() loadRepliesClicked = new EventEmitter<string>(); // Parent ID döner

  // UI State
  isReplying: boolean = false;
  replyText: string = '';
  
  // Enum
  targetTypeComment = ReactionTargetType.Comment;

  constructor(public authService: AuthService) {}

  // --- ACTIONS ---

  toggleReplyForm() {
    this.isReplying = !this.isReplying;
    if (!this.isReplying) this.replyText = '';
  }

  submitReply() {
    if (!this.replyText.trim()) return;
    
    // Event'i yukarı fırlat
    this.replySubmitted.emit({
      parentId: this.comment.id,
      content: this.replyText
    });

    // Reset
    this.isReplying = false;
    this.replyText = '';
  }

  // Recursive Event Bubble (Alt componentten gelen eventleri yukarı taşı)
  onNestedReplySubmitted(event: { parentId: string, content: string }) {
    this.replySubmitted.emit(event);
  }

  onNestedDeleteClicked(commentId: string) {
    this.deleteClicked.emit(commentId);
  }

  onNestedUpdateClicked(comment: CommentDto) {
    this.updateClicked.emit(comment);
  }

  toggleChildrenVisibility() {
    // Eğer true ise false, false/undefined ise true yapar.
    // Not: CommentDto içinde 'isViewingReplies' alanı tanımlı olmalı.
    this.comment.isViewingReplies = !this.comment.isViewingReplies;
  }

  // Mevcut kullanıcının reaction'ını döndür
  getCurrentUserReaction(): ReactionType | null {
    if (this.comment.isLiked) {
      return ReactionType.Like;
    } else if (this.comment.isDisliked) {
      return ReactionType.Dislike;
    }
    return null;
  }
}

