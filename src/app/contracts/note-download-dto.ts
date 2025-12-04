export interface NoteDownloadDto {
  id: string;
  downloadedDate: Date;
  downloaderId: string;
  downloaderUsername: string;
  downloaderAvatar?: string; 
  noteId: string;
  noteTitle: string;
  noteCategory: string;
}