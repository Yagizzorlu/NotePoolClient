import { HttpErrorResponse } from '@angular/common/http';
import { Create_Note} from '../../../contracts/create_note';
import { HttpClientService } from './../http-client.service';
import { Injectable } from '@angular/core';
import { List_Note } from '../../../contracts/list_note';
import { firstValueFrom, Observable } from 'rxjs';
import { List_Note_File } from '../../../contracts/list_note_file';

@Injectable({
  providedIn: 'root'
})
export class NoteService {

  constructor(private httpClientService : HttpClientService) { }

  createNote(note : Create_Note, successCallBack? : () => void, errorCallBack? : (errorMessage:string) => void) {
    this.httpClientService.post({
      controller : "notes"
    }, note)
    .subscribe(result => {
      successCallBack();
    }, (errorResponse: HttpErrorResponse) => {
      const _error : Array<{key : string, value : Array<string>}> = errorResponse.error;
      let message = "";
      _error.forEach((v, index) => {
        v.value.forEach((_v,_index) => {
          message += `${_v}<br>`;
        });
      });
      errorCallBack(message);
    });
  }

  

  async read(page: number = 0, size: number = 5, successCallBack? : () => void, errorCallBack? : 
  (errorMessage : string) => void) : Promise<{totalCount : number;
      notes: List_Note[]}> {
        
    const promiseData : Promise<{totalCount : number;
      notes: List_Note[]}> = this.httpClientService.get<{ totalCount : number; notes: List_Note[]}>( {
      controller : "notes",
      queryString: `page=${page}&size=${size}`
    }).toPromise();

    promiseData.then(d => successCallBack())
    .catch((errorResponse: HttpErrorResponse) => errorCallBack(errorResponse.message))

    return await promiseData;
  }


  async delete(id : string) {
    const deleteObservable : Observable<any> = this.httpClientService.delete<any>({
      controller : "notes"
    }, id);

    await firstValueFrom(deleteObservable);
  }

  async readFiles(id : string, successCallBack? : () => void): Promise<List_Note_File[]> {
    const getObservable : Observable<List_Note_File[]> = this.httpClientService.get<List_Note_File[]>({
      action:"getNoteFiles",
      controller : "notes"
    },id);

    const files : List_Note_File[] = await firstValueFrom(getObservable);
    successCallBack();
    return files;
  }

  async deleteFile(id : string, fileId : string, successCallBack? : () => void) {
    const deleteObservable = this.httpClientService.delete({
      action:"deleteNoteFile",
      controller : "notes",
      queryString : `fileId = ${fileId}`
    },id)
    await firstValueFrom(deleteObservable);
    successCallBack();
  }
createWithPdf(
  note: Create_Note,
  files: File[],
  successCallBack?: (createdId: string) => void,
  errorCallBack?: (errorMessage: string) => void
) {
  // Basit doğrulama
  if (!note?.title?.trim()) {
    errorCallBack?.('Başlık zorunludur.');
    return;
  }
  if (!files?.length) {
    errorCallBack?.('En az bir PDF seçmelisiniz.');
    return;
  }

  const fd = new FormData();
  // Backend CreateNoteCommandRequest model alan adlarıyla birebir (PascalCase)
  fd.append('Title', note.title ?? '');
  fd.append('Description', note.description ?? '');
  fd.append('Tags', note.tags ?? '');
  fd.append('CourseId', note.courseId);
  fd.append('InstitutionId', note.institutionId);
  fd.append('DepartmentId', note.departmentId);
  fd.append('UserId', note.userId);

  for (const f of files) {
    // IFormFileCollection -> "Files" anahtarı
    fd.append('Files', f, f.name);
  }

  // Backend'de [HttpPost] direkt POST /api/notes endpoint'i var
  this.httpClientService.post<{ NoteId?: string; noteId?: string; Success?: boolean; success?: boolean; Message?: string; message?: string }>(
    { controller: 'notes' },
    fd as any // <-- mevcut post<T> imzası Partial<T> beklediği için sadece burada cast ediyoruz
  ).subscribe({
    next: res => {
      const noteId = res?.NoteId || res?.noteId;
      successCallBack?.(noteId || '');
    },
    error: (err: HttpErrorResponse) => {
      let message = '';
      if (err?.error) {
        if (Array.isArray(err.error)) {
          const _error: Array<{ key: string; value: Array<string> }> = err.error;
          _error?.forEach(v => v.value.forEach(_v => message += `${_v}<br>`));
        } else if (err.error.message) {
          message = err.error.message;
        } else if (typeof err.error === 'string') {
          message = err.error;
        }
      }
      if (!message) {
        message = err?.message || 'Yükleme başarısız.';
      }
      errorCallBack?.(message);
    }
  });
}
}