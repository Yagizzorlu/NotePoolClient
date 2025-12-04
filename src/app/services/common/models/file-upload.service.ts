import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { NoteFileDto } from '../../../contracts/note-file-dto';
import { HttpClientService } from '../http-client.service';

export interface UploadNotePdfResponse {
  isSuccess: boolean;
  message: string;
  uploadedFiles: NoteFileDto[];
}

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor(private httpClientService: HttpClientService) { }

  /**
   * Mevcut bir nota sonradan PDF eklemek için.
   * @param noteId Dosyaların ekleneceği notun ID'si
   * @param files Eklenecek dosyalar
   */
  async uploadNoteFiles(noteId: string, files: File[]): Promise<UploadNotePdfResponse> {
    const formData = new FormData();
    
    // Backend Request: UploadNotePdfFileCommandRequest
    formData.append('NoteId', noteId);
    
    for (const file of files) {
      formData.append('Files', file, file.name);
    }

    const observable = this.httpClientService.post<UploadNotePdfResponse>({
      controller: "notepdffiles"
    }, formData);

    return await firstValueFrom(observable);
  }

  /**
   * Bir notun dosyalarını listeler.
   * @param noteId Not ID
   */
  async getNoteFiles(noteId: string): Promise<NoteFileDto[]> {
    
    const observable = this.httpClientService.get<{ files: NoteFileDto[] }>({
      controller: "notepdffiles",
      queryString: `noteId=${noteId}`
    });

    const response = await firstValueFrom(observable);
    return response.files || [];
  }
  async deleteFile(noteId: string, fileId: string): Promise<void> {
    const complexIdRoute = `${noteId}/file/${fileId}`;

    const observable = this.httpClientService.delete({
      controller: "notepdffiles"
    }, complexIdRoute);

    await firstValueFrom(observable);
  }
}
