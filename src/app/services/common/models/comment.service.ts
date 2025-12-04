import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { CreateCommentRequest } from '../../../contracts/create-comment-request';
import { CommentListResponse } from '../../../contracts/comment-list-response';
import { HttpClientService } from '../http-client.service';

// Update için basit bir interface (Contracts klasöründe yoksa buraya koyabiliriz veya oluşturabilirsin)
export interface UpdateCommentRequest {
  id: string;
  content: string;
}

@Injectable({
  providedIn: 'root'
})
export class CommentService {

  constructor(private httpClientService: HttpClientService) { }

  // 1. YORUM EKLEME
  // POST api/comments
  async create(request: CreateCommentRequest): Promise<void> {
    const observable = this.httpClientService.post({
      controller: "comments"
    }, request);

    await firstValueFrom(observable);
  }
  async update(request: UpdateCommentRequest): Promise<void> {
    const observable = this.httpClientService.put({
      controller: "comments"
    }, request);

    await firstValueFrom(observable);
  }
  async remove(id: string): Promise<void> {
    const observable = this.httpClientService.delete({
      controller: "comments"
    }, id);

    await firstValueFrom(observable);
  }
  async getAll(
    page: number = 0, 
    size: number = 10, 
    noteId?: string, 
    userId?: string,
    parentId?: string
  ): Promise<CommentListResponse> {
    
    let queryString = `page=${page}&size=${size}`;

    if (noteId) queryString += `&noteId=${noteId}`;
    if (userId) queryString += `&userId=${userId}`;
    if (parentId) queryString += `&parentId=${parentId}`;

    const observable = this.httpClientService.get<CommentListResponse>({
      controller: "comments",
      queryString: queryString
    });

    return await firstValueFrom(observable);
  }
}