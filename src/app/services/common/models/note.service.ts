import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { UpdateNoteRequest } from '../../../contracts/update-note-request';
import { NoteListResponse } from '../../../contracts/note-list-response';
import { NoteDetail } from '../../../contracts/note-detail';
import { NoteFileDto } from '../../../contracts/note-file-dto';
import { CreateNoteRequest } from '../../../contracts/create_note-request';
import { IncrementViewCountRequest } from '../../../contracts/increment-view-count-request';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private httpClientService: HttpClientService) { }

  // 1. NOT OLUŞTURMA (POST api/notes - FromForm)
  /**
   * Not oluşturur ve dosyaları yükler.
   * @param note Not bilgileri (Başlık, İçerik vb.)
   * @param files PDF Dosyaları (Zorunlu)
   * @returns Oluşturulan Notun ID'si
   */
  async create(note: CreateNoteRequest, files: File[]): Promise<string> {
    
    if (!files || files.length === 0) {
      throw new Error("Not yükleyebilmek için en az bir PDF dosyası seçmelisiniz.");
    }

    const formData = new FormData();
    
    formData.append('Title', note.title);
    if (note.description) formData.append('Description', note.description);
    if (note.tags) formData.append('Tags', note.tags);
    formData.append('CourseId', note.courseId);
    for (const file of files) {
      formData.append('Files', file, file.name);
    }
    const observable = this.httpClientService.post<{ noteId: string }>({
      controller: "notes"
    }, formData);

    const response = await firstValueFrom(observable);
    return response.noteId;
  }

  // 2. GÜNCELLEME (PUT api/notes - FromBody)
  async update(note: UpdateNoteRequest): Promise<void> {
    const observable = this.httpClientService.put({
      controller: "notes"
    }, note); // JSON olarak gider

    await firstValueFrom(observable);
  }

  async getAll(page: number = 0, size: number = 10, filters?: any): Promise<NoteListResponse> {
    
    let queryString = `page=${page}&size=${size}`;
    
    if (filters) {
      if (filters.searchTerm) queryString += `&searchTerm=${encodeURIComponent(filters.searchTerm)}`;
      if (filters.courseId) queryString += `&courseId=${filters.courseId}`;
      if (filters.institutionId) queryString += `&institutionId=${filters.institutionId}`;
      if (filters.departmentId) queryString += `&departmentId=${filters.departmentId}`;
      if (filters.userId) queryString += `&userId=${filters.userId}`;
      if (filters.isBookmarked) queryString += `&isBookmarkedByCurrentUser=true`;
      if (filters.sortBy) queryString += `&sortBy=${filters.sortBy}`;
      if (filters.sortOrder) queryString += `&sortOrder=${filters.sortOrder}`;
    }

    const observable = this.httpClientService.get<NoteListResponse>({
      controller: "notes",
      queryString: queryString
    });

    return await firstValueFrom(observable);
  }
  async getById(id: string): Promise<NoteDetail> {
    const observable = this.httpClientService.get<NoteDetail>({
      controller: "notes",
      action: "details",
      queryString: `Id=${id}` 
    });

    return await firstValueFrom(observable);
  }
  async remove(id: string): Promise<void> {
    const observable = this.httpClientService.delete({
      controller: "notes"
    }, id);

    await firstValueFrom(observable);
  }
  async deleteFile(noteId: string, fileId: string): Promise<void> {
    
    const complexIdRoute = `${noteId}/file/${fileId}`;

    const observable = this.httpClientService.delete({
      controller: "notepdffiles" 
    }, complexIdRoute);

    await firstValueFrom(observable);
  }

  async getNoteFiles(noteId: string): Promise<NoteFileDto[]> {
    const observable = this.httpClientService.get<{ files: NoteFileDto[] }>({
      controller: "notepdffiles",
      queryString: `noteId=${noteId}`
    });

    const response = await firstValueFrom(observable);
    return response.files || [];
  }

  async incrementViewCount(noteId: string): Promise<void> {
    const requestBody: IncrementViewCountRequest = { noteId: noteId };

    const observable = this.httpClientService.post({
      controller: "notes",
      action: "increment-view-count"
    }, requestBody);

    await firstValueFrom(observable);
  }
}