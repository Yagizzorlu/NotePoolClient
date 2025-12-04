import { NoteListDto } from "./note-list-dto";

export class NoteListResponse {
    totalCount: number;
    notes: NoteListDto[];
}