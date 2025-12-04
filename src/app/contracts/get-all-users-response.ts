export interface UserListDto {
  id: string;
  userName: string;
  email: string;
  fullName: string;
  institutionName: string;
  departmentName: string;
  profileImage? : string;
  
  // İstatistikler
  notesCount: number;
  commentsCount: number;
  repliesCount: number;
  bookmarksCount: number;
  reactionsCount: number;
  downloadsCount: number;
}

export interface GetAllUsersResponse {
  totalCount: number;
  users: UserListDto[];
}