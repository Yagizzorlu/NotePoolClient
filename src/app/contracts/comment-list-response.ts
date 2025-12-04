import { CommentDto } from "./comment-dto";

export interface CommentListResponse {
  totalCount: number;
  comments: CommentDto[];
}