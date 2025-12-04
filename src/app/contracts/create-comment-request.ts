export interface CreateCommentRequest {
  noteId: string;
  content: string;
  parentId?: string;
}