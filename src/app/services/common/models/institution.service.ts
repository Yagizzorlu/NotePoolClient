import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';

// CONTRACTS (DTOs)
import { InstitutionDto } from '../../../contracts/institution-dto';
import { HttpClientService } from '../http-client.service';

// Backend'den dönen Listeleme Cevabı (Wrapper)
export interface GetAllInstitutionsResponse {
  totalCount: number;
  institutions: InstitutionDto[];
}

// Request Modelleri
export interface CreateInstitutionRequest {
  name: string;
  city?: string;
}

export interface UpdateInstitutionRequest {
  id: string;
  name: string;
  city?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InstitutionService {

  constructor(private httpClientService: HttpClientService) {}
  async getAllInstitutions(
    page: number = 0, 
    size: number = 10, 
    searchTerm?: string
  ): Promise<GetAllInstitutionsResponse> {
    
    let queryString = `page=${page}&size=${size}`;

    if (searchTerm) {
      queryString += `&searchTerm=${searchTerm}`;
    }

    const observable = this.httpClientService.get<GetAllInstitutionsResponse>({
      controller: "institutions",
      queryString: queryString
    });

    return await firstValueFrom(observable);
  }
  async getById(id: string): Promise<InstitutionDto> {
    const observable = this.httpClientService.get<InstitutionDto>({
      controller: "institutions"
    }, id);

    return await firstValueFrom(observable);
  }
  async create(request: CreateInstitutionRequest): Promise<void> {
    const observable = this.httpClientService.post({
      controller: "institutions"
    }, request);

    await firstValueFrom(observable);
  }
  async update(request: UpdateInstitutionRequest): Promise<void> {
    const observable = this.httpClientService.put({
      controller: "institutions"
    }, request);

    await firstValueFrom(observable);
  }

  async delete(id: string): Promise<void> {
    const observable = this.httpClientService.delete({
      controller: "institutions"
    }, id);

    await firstValueFrom(observable);
  }
}