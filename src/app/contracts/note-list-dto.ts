export class NoteListDto {
    id: string;
    title: string;
    description: string;
    createdDate: Date;
    viewCount: number;
    downloadCount: number;
    likeCount: number;
    commentCount: number;
    bookmarkCount: number;
    isBookmarked: boolean;
    isDownloaded: boolean;
    isLiked : boolean;
    isDisliked?: boolean;
    dislikeCount?: number;
    userId: string;
    authorName: string;
    authorAvatar?: string; 
    courseName: string;
}