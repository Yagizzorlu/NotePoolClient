import { Component, Input } from '@angular/core';
import { NoteDetail } from '../../../../contracts/note-detail';

@Component({
  selector: 'app-note-meta',
  templateUrl: './note-meta.component.html',
  styleUrls: ['./note-meta.component.scss']
})
export class NoteMetaComponent {
  // Tüm detay verisini alıyoruz
  @Input() note!: NoteDetail;
}
