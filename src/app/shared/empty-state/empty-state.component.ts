import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  templateUrl: './empty-state.component.html',
  styleUrls: ['./empty-state.component.scss']
})
export class EmptyStateComponent {
  // --- KONFİGÜRASYON ---
  @Input() title: string = 'Kayıt Bulunamadı';
  @Input() message: string = 'Arama kriterlerinize uygun veri bulunmuyor.';
  
  // İkon seçeneği (FontAwesome class)
  @Input() icon: string = 'fa-solid fa-box-open'; 
  
  // Özel Resim seçeneği (Eğer SVG illüstrasyon kullanmak istersen)
  @Input() imageSrc?: string;
}
