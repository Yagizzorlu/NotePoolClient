export interface UserProfileDto {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email?: string; 
  profileImage?: string;
  institutionName?: string;
  departmentName?: string;
  notesCount: number;
  commentsCount: number;
  repliesCount: number;
  bookmarksCount: number;
  reactionsCount: number;
  downloadsCount: number;
}