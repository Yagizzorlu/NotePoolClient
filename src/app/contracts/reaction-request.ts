export enum ReactionType {
  Like = 1,
  Dislike = 2
}

export enum ReactionTargetType {
  Note = 1,
  Comment = 2
}

export interface ReactionRequest {
  targetId: string;      
  targetType: ReactionTargetType; 
  reactionType: ReactionType;   
}