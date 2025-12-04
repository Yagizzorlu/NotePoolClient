import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { CourseDto } from '../../../contracts/course-dto';
import { HttpClientService } from '../http-client.service';

// Response Wrapper
export interface GetAllCoursesResponse {
  totalCount: number;
  courses: CourseDto[];
}

// Request Modelleri
export interface CreateCourseRequest {
  name: string;
  code?: string;
  year: number;
  departmentId: string;
}

export interface UpdateCourseRequest {
  id: string;
  name: string;
  code?: string;
  year: number;
  departmentId: string;
}

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private httpClientService: HttpClientService) {}
  async getAllCourses(
    page: number = 0, 
    size: number = 10, 
    departmentId?: string, 
    searchTerm?: string
  ): Promise<GetAllCoursesResponse> {
    
    let queryString = `page=${page}&size=${size}`;

    if (departmentId) {
      queryString += `&departmentId=${departmentId}`;
    }
    if (searchTerm) {
      queryString += `&searchTerm=${searchTerm}`;
    }

    const observable = this.httpClientService.get<GetAllCoursesResponse>({
      controller: "courses",
      queryString: queryString
    });

    return await firstValueFrom(observable);
  }
  async getById(id: string): Promise<CourseDto> {
    const observable = this.httpClientService.get<CourseDto>({
      controller: "courses"
    }, id);

    return await firstValueFrom(observable);
  }
  async create(request: CreateCourseRequest): Promise<void> {
    const observable = this.httpClientService.post({
      controller: "courses"
    }, request);

    await firstValueFrom(observable);
  }
  async update(request: UpdateCourseRequest): Promise<void> {
    const observable = this.httpClientService.put({
      controller: "courses"
    }, request);

    await firstValueFrom(observable);
  }
  async delete(id: string): Promise<void> {
    const observable = this.httpClientService.delete({
      controller: "courses"
    }, id);

    await firstValueFrom(observable);
  }
}


