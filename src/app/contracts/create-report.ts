export enum ReportReason {
  Spam = 1,
  InappropriateContent = 2, 
  Other = 3
}

export interface CreateReportRequest {
  noteId?: string;
  commentId?: string;
  reason: ReportReason;
  description?: string;
}
