export interface ReportListDto {
  id: string;
  createdDate: Date;
  reporterUsername: string;
  reporterAvatar?: string; 
  targetType: 'Note' | 'Comment'; 
  targetId: string;
  targetTitle: string; 
  reason: string; 
  status: string; 
}