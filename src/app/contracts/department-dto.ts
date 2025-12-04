export interface DepartmentDto {
  id: string;
  name: string;
  code?: string; 
  institutionId: string;
  institutionName: string; 
  courseCount: number; 
}