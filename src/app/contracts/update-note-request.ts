export interface UpdateNoteRequest {
  id: string;
  title: string;
  description?: string;
  tags?: string;
}