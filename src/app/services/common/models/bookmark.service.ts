import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ToggleBookmarkRequest } from '../../../contracts/toggle-bookmark-request';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class BookmarkService {

  constructor(private httpClient: HttpClientService) { }

  async toggleBookmark(request: ToggleBookmarkRequest): Promise<any> {
    const observable = this.httpClient.post({
      controller: "bookmarks"
    }, request);

    return await firstValueFrom(observable);
  }
}