export interface CreateNoteRequest {
  title: string;
  description?: string;
  tags?: string;        
  courseId: string;
  files?: File[]; 
}
