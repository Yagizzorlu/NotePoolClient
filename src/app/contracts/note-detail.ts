export interface NoteDetail {
  id: string;
  title: string;
  description: string;
  createdDate: Date;
  tags?: string;
  viewCount: number;
  downloadCount: number;
  likeCount: number;
  commentCount: number;
  isBookmarked: boolean;
  isLiked: boolean;
  isDownloaded: boolean;
  isOwner: boolean; 
  institutionName: string;
  departmentName: string;
  courseName: string;
  author: {
    id: string;
    username: string;
    profileImage?: string;
  };
  files: {
    fileName: string;
    path: string;
  }[];
}