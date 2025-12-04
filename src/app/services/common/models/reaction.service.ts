import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ReactionRequest, ReactionType } from '../../../contracts/reaction-request';
import { HttpClientService } from '../http-client.service';
import { ReactionResponse } from '../../../contracts/reaction.response';
export interface GetAllReactionsResponse {
  totalCount: number;
  reactions: ReactionDto[];
}

export interface ReactionDto {
  id: string;
  createdDate: Date;
  type: string;
  
  userId: string;
  username: string;
  userAvatar?: string;

  targetType: string;
  targetId: string;
  targetTitle: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReactionService {

  constructor(private httpClientService: HttpClientService) { }

  async setReaction(request: ReactionRequest): Promise<ReactionResponse> {
    const observable = this.httpClientService.post<ReactionResponse>({
      controller: "reactions"
    }, request);

    return await firstValueFrom(observable);
  }

  async getAll(
    page: number = 0, 
    size: number = 10, 
    filters?: { 
      noteId?: string, 
      commentId?: string, 
      userId?: string, 
      type?: ReactionType 
    }
  ): Promise<GetAllReactionsResponse> {
    
    let queryString = `page=${page}&size=${size}`;

    if (filters) {
      if (filters.noteId) queryString += `&noteId=${filters.noteId}`;
      if (filters.commentId) queryString += `&commentId=${filters.commentId}`;
      if (filters.userId) queryString += `&userId=${filters.userId}`;
      if (filters.type) queryString += `&type=${filters.type}`;
    }

    const observable = this.httpClientService.get<GetAllReactionsResponse>({
      controller: "reactions",
      queryString: queryString
    });

    return await firstValueFrom(observable);
  }
}

