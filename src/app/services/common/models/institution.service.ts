// institution.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../http-client.service';
import { map } from 'rxjs/operators';

interface InstitutionResponse {
  Institutions?: { Id: string; Name: string; City?: string }[];
  institutions?: { id: string; name: string; city?: string }[];
  TotalCount?: number;
}

@Injectable({ providedIn: 'root' })
export class InstitutionService {
  constructor(private httpClientService: HttpClientService) {}

  getInstitutions(): Observable<{ id: string; name: string }[]> {
    return this.httpClientService.get<any>({
      controller: 'institutions'
    }).pipe(
      map(response => {
        // Backend'den wrapper object olarak gelirse
        if (response?.Institutions && Array.isArray(response.Institutions)) {
          return response.Institutions.map((inst: any) => ({
            id: inst.Id || inst.id || '',
            name: inst.Name || inst.name || ''
          }));
        }
        // Backend'den direkt array olarak gelirse
        if (Array.isArray(response)) {
          return response.map((inst: any) => ({
            id: inst.Id || inst.id || '',
            name: inst.Name || inst.name || ''
          }));
        }
        // institutions (küçük harf) olarak gelirse
        if (response?.institutions && Array.isArray(response.institutions)) {
          return response.institutions.map((inst: any) => ({
            id: inst.id || inst.Id || '',
            name: inst.name || inst.Name || ''
          }));
        }
        return [];
      })
    );
  }
}