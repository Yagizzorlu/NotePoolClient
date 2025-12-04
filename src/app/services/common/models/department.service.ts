import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { DepartmentDto } from '../../../contracts/department-dto';
import { HttpClientService } from '../http-client.service';
export interface GetAllDepartmentsResponse {
  totalCount: number;
  departments: DepartmentDto[];
}

export interface CreateDepartmentRequest {
  name: string;
  code?: string;
  institutionId: string;
}

export interface UpdateDepartmentRequest {
  id: string;
  name: string;
  code?: string;
  institutionId: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private httpClientService: HttpClientService) {}

  async getAllDepartments(
    page: number = 0, 
    size: number = 10, 
    institutionId?: string, 
    searchTerm?: string
  ): Promise<GetAllDepartmentsResponse> {
    
    let queryString = `page=${page}&size=${size}`;

    if (institutionId) {
      queryString += `&institutionId=${institutionId}`;
    }
    if (searchTerm) {
      queryString += `&searchTerm=${searchTerm}`;
    }

    const observable = this.httpClientService.get<GetAllDepartmentsResponse>({
      controller: "departments",
      queryString: queryString
    });

    return await firstValueFrom(observable);
  }
  async getById(id: string): Promise<DepartmentDto> {
    const observable = this.httpClientService.get<DepartmentDto>({
      controller: "departments"
    }, id);

    return await firstValueFrom(observable);
  }
  async create(request: CreateDepartmentRequest): Promise<void> {
    const observable = this.httpClientService.post({
      controller: "departments"
    }, request);

    await firstValueFrom(observable);
  }
  async update(request: UpdateDepartmentRequest): Promise<void> {
    const observable = this.httpClientService.put({
      controller: "departments"
    }, request);

    await firstValueFrom(observable);
  }
  async delete(id: string): Promise<void> {
    const observable = this.httpClientService.delete({
      controller: "departments"
    }, id);

    await firstValueFrom(observable);
  }
}



