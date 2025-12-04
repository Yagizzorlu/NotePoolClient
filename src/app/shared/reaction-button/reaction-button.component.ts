import { Component, Input, OnInit } from '@angular/core';
import { ReactionTargetType, ReactionType } from '../../contracts/reaction-request';
import { ReactionService } from '../../services/common/models/reaction.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/custom-toastr.service';

@Component({
  selector: 'app-reaction-button',
  templateUrl: './reaction-button.component.html',
  styleUrls: ['./reaction-button.component.scss']
})
export class ReactionButtonComponent implements OnInit {
  
  // --- INPUTS ---
  @Input() targetId!: string;
  @Input() targetType!: ReactionTargetType;
  
  @Input() likeCount: number = 0;
  @Input() dislikeCount: number = 0;
  @Input() currentUserReaction?: ReactionType | null;

  isLoading: boolean = false;
  RT = ReactionType; 

  constructor(
    private reactionService: ReactionService,
    private toastr: CustomToastrService
  ) {}

  ngOnInit(): void {}

  async onReact(type: ReactionType) {
    if (this.isLoading) return; // Çift tıklamayı önle

    // 1. MEVCUT DURUMU SAKLA (Rollback için)
    const previousState = {
      reaction: this.currentUserReaction,
      likes: this.likeCount,
      dislikes: this.dislikeCount
    };
    this.calculateOptimisticCounts(type);

    // 3. API ÇAĞRISI
    try {
      this.isLoading = true;
      const response = await this.reactionService.setReaction({
        targetId: this.targetId,
        targetType: this.targetType,
        reactionType: type
      });
      this.likeCount = response.newLikeCount;
      this.dislikeCount = response.newDislikeCount;
      this.currentUserReaction = response.currentUserReaction ?? null;

    } catch (error) {
      this.currentUserReaction = previousState.reaction;
      this.likeCount = previousState.likes;
      this.dislikeCount = previousState.dislikes;
      
      this.toastr.message("İşlem gerçekleştirilemedi.", "Hata", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.BottomRight
      });
    } finally {
      this.isLoading = false;
    }
  }
  private calculateOptimisticCounts(newType: ReactionType) {
    if (this.currentUserReaction === newType) {
      this.currentUserReaction = null;
      if (newType === ReactionType.Like) this.likeCount--;
      else this.dislikeCount--;
    } 
    else if (this.currentUserReaction == null) {
      this.currentUserReaction = newType;
      if (newType === ReactionType.Like) this.likeCount++;
      else this.dislikeCount++;
    } 
    else {
      if (this.currentUserReaction === ReactionType.Like) this.likeCount--;
      else this.dislikeCount--;
      this.currentUserReaction = newType;
      if (newType === ReactionType.Like) this.likeCount++;
      else this.dislikeCount++;
    }
  }
}

