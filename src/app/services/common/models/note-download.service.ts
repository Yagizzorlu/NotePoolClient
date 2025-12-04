import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Blob için saf client
import { firstValueFrom, Observable } from 'rxjs';
import { NoteDownloadDto } from '../../../contracts/note-download-dto';
import { HttpClientService } from '../http-client.service';

export interface GetAllNoteDownloadsResponse {
  totalCount: number;
  downloads: NoteDownloadDto[];
}

@Injectable({
  providedIn: 'root'
})
export class NoteDownloadService {

  constructor(
    private http: HttpClient, 
    private httpClientService: HttpClientService, 
    @Inject("baseUrl") private baseUrl: string
  ) { }

  async downloadNote(noteId: string): Promise<void> {
    const url = `${this.baseUrl}/notedownloads/download/${noteId}`;

    const observable = this.http.post(url, {}, { 
      responseType: 'blob', 
      observe: 'response' 
    });

    const response = await firstValueFrom(observable);
    const blob = response.body;
    if (!blob) return;

    const contentDisposition = response.headers.get('content-disposition');
    let fileName = `note-${noteId}.pdf`;
    
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches != null && matches[1]) { 
        fileName = matches[1].replace(/['"]/g, '');
      }
    }

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  // 2. İNDİRME GEÇMİŞİ / LİSTELEME
  // GET api/notedownloads?page=...&userId=...
  async getAll(page: number = 0, size: number = 10, userId?: string, noteId?: string): Promise<GetAllNoteDownloadsResponse> {
    
    let queryString = `page=${page}&size=${size}`;

    if (userId) queryString += `&userId=${userId}`;
    if (noteId) queryString += `&noteId=${noteId}`;

    const observable = this.httpClientService.get<GetAllNoteDownloadsResponse>({
      controller: "notedownloads",
      queryString: queryString
    });

    return await firstValueFrom(observable);
  }

  // 3. SİLME
  // DELETE api/notedownloads/{id}
  async remove(id: string): Promise<void> {
    const observable = this.httpClientService.delete({
      controller: "notedownloads"
    }, id);

    await firstValueFrom(observable);
  }
}

