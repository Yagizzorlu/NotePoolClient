export interface CommentDto {
  id: string;
  content: string;
  createdDate: Date;
  parentId?: string;
  replyCount: number;
  noteId: string;
  noteTitle: string;
  userId: string;
  username: string;
  userAvatar?: string;
  likeCount?: number;
  dislikeCount?: number;
  isLiked?: boolean;
  isDisliked?: boolean;
  replies?: CommentDto[]; 
  isReplying?: boolean;     
  isViewingReplies?: boolean;
}