import { ReactionType } from "./reaction-request";

export interface ReactionResponse {
  newLikeCount: number;
  newDislikeCount: number;
  currentUserReaction?: ReactionType; 
}