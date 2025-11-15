// department.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../http-client.service';
import { map } from 'rxjs/operators';

interface DepartmentResponse {
  Departments?: { Id: string; Name: string; Code?: string; InstitutionId: string }[];
  departments?: { id: string; name: string; code?: string; institutionId: string }[];
  TotalCount?: number;
}

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  constructor(private httpClientService: HttpClientService) {}

  getDepartments(): Observable<{ id: string; name: string; institutionId: string }[]> {
    return this.httpClientService.get<any>({
      controller: 'departments'
    }).pipe(
      map(response => {
        // Backend'den wrapper object olarak gelirse
        if (response?.Departments && Array.isArray(response.Departments)) {
          return response.Departments.map((dept: any) => ({
            id: dept.Id || dept.id || '',
            name: dept.Name || dept.name || '',
            institutionId: dept.InstitutionId || dept.institutionId || ''
          }));
        }
        // Backend'den direkt array olarak gelirse
        if (Array.isArray(response)) {
          return response.map((dept: any) => ({
            id: dept.Id || dept.id || '',
            name: dept.Name || dept.name || '',
            institutionId: dept.InstitutionId || dept.institutionId || ''
          }));
        }
        // departments (küçük harf) olarak gelirse
        if (response?.departments && Array.isArray(response.departments)) {
          return response.departments.map((dept: any) => ({
            id: dept.id || dept.Id || '',
            name: dept.name || dept.Name || '',
            institutionId: dept.institutionId || dept.InstitutionId || ''
          }));
        }
        return [];
      })
    );
  }
}

