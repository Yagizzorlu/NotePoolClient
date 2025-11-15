import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService } from '../http-client.service';
import { map } from 'rxjs/operators';

interface CourseResponse {
  Courses?: { Id: string; Name: string; DepartmentId?: string }[];
  courses?: { id: string; name: string; departmentId?: string }[];
  TotalCount?: number;
}

@Injectable({ providedIn: 'root' })
export class CourseService {
  constructor(private httpClientService: HttpClientService) {}

  getCourses(): Observable<{ id: string; name: string; departmentId?: string }[]> {
    return this.httpClientService.get<CourseResponse>({
      controller: 'courses'
    }).pipe(
      map(response => {
        if (response.Courses && response.Courses.length > 0) {
          return response.Courses.map(c => ({
            id: c.Id,
            name: c.Name,
            departmentId: c.DepartmentId
          }));
        } else if (response.courses && response.courses.length > 0) {
          return response.courses;
        }
        return [];
      })
    );
  }

  getCoursesByDepartment(departmentId: string): Observable<{ id: string; name: string; departmentId?: string }[]> {
    return this.httpClientService.get<CourseResponse>({
      controller: 'courses',
      action: 'by-department',
      queryString: null
    }, departmentId).pipe(
      map(response => {
        if (response.Courses && response.Courses.length > 0) {
          return response.Courses.map(c => ({
            id: c.Id,
            name: c.Name,
            departmentId: c.DepartmentId
          }));
        } else if (response.courses && response.courses.length > 0) {
          return response.courses;
        }
        return [];
      })
    );
  }
}

