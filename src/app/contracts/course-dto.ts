export interface CourseDto {
  id: string;
  name: string;
  code?: string; 
  year: number; 
  departmentId: string;
  departmentName: string; 
  noteCount: number; 
}