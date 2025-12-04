import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

// DTO (Contract'taki yapıyı kullanıyoruz, ayrı bir interface açmaya gerek yok)
interface PdfFile {
  fileName: string;
  path: string;
}

@Component({
  selector: 'app-note-pdf-viewer',
  templateUrl: './note-pdf-viewer.component.html',
  styleUrls: ['./note-pdf-viewer.component.scss']
})
export class NotePdfViewerComponent implements OnChanges {

  @Input() files: PdfFile[] = [];

  // Şu an görüntülenen dosya
  activeFile: PdfFile | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    // Dosyalar yüklendiğinde otomatik olarak ilkini seç
    if (changes['files'] && this.files && this.files.length > 0) {
      this.selectFile(this.files[0]);
    }
  }

  selectFile(file: PdfFile) {
    this.activeFile = file;
  }

  // Dosya adını temiz göstermek için (Uzun isimleri kesersek UI bozulmaz)
  // Not: Bunu template'de truncate pipe ile de yapabiliriz ama logic burada kalsın.
}
