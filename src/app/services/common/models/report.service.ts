import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { ReportListDto } from '../../../contracts/report-list-dto';
import { CreateReportRequest } from '../../../contracts/create-report';
import { HttpClientService } from '../http-client.service';
export interface GetAllReportsResponse {
  totalCount: number;
  reports: ReportListDto[];
}

export interface UpdateReportRequest {
  id: string;
  status: number; 
  adminNote?: string;
}

export interface ReportDetailDto {
  id: string;
  createdDate: Date;
  status: string;
  reason: string;
  description: string;
  adminNote: string;
  
  reporterUsername: string;
  reporterAvatar: string;

  targetType: string;
  targetId: string;
  targetTitle: string;
  targetContent: string;
  
  targetOwnerUsername: string;
  targetOwnerAvatar: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  constructor(private httpClientService: HttpClientService) { }
  async create(request: CreateReportRequest): Promise<void> {
    const observable = this.httpClientService.post({
      controller: "reports"
    }, request);

    await firstValueFrom(observable);
  }

  async getAll(
    page: number = 0, 
    size: number = 20, 
    status?: number, 
    typeFilter?: number 
  ): Promise<GetAllReportsResponse> {
    
    let queryString = `page=${page}&size=${size}`;

    if (status !== undefined) queryString += `&status=${status}`;
    if (typeFilter !== undefined) queryString += `&typeFilter=${typeFilter}`;

    const observable = this.httpClientService.get<GetAllReportsResponse>({
      controller: "reports",
      queryString: queryString
    });

    return await firstValueFrom(observable);
  }
  async getById(id: string): Promise<ReportDetailDto> {
    const observable = this.httpClientService.get<ReportDetailDto>({
      controller: "reports"
    }, id);

    return await firstValueFrom(observable);
  }

  async update(request: UpdateReportRequest): Promise<void> {
    const observable = this.httpClientService.put({
      controller: "reports"
    }, request);

    await firstValueFrom(observable);
  }

  async remove(id: string): Promise<void> {
    const observable = this.httpClientService.delete({
      controller: "reports"
    }, id);

    await firstValueFrom(observable);
  }
}
