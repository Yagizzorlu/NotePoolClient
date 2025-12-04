import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.scss'
})
export class UserAvatarComponent implements OnChanges {
  
  @Input() imageUrl?: string;
  @Input() altText?: string;
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() showStatus: boolean = false;

  private baseApiUrl = 'https://localhost:7111/'; // Backend adresin
  public finalUrl: string | undefined;
  public hasError: boolean = false; 

  // Input (imageUrl) her değiştiğinde burası çalışır
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imageUrl']) {
      this.hasError = false; // Hatayı sıfırla
      this.generateUrl();    // Yeni URL oluştur
    }
  }

  generateUrl() {
    if (!this.imageUrl) {
      this.finalUrl = undefined;
      return;
    }

    // Eğer zaten tam link geliyorsa (Google vs)
    if (this.imageUrl.startsWith('http')) {
      this.finalUrl = this.imageUrl;
    } else {
      // Backend'den geliyorsa temizle ve birleştir
      let cleanUrl = this.imageUrl.startsWith('/') ? this.imageUrl.substring(1) : this.imageUrl;
      
      // ÖNEMLİ: Sonuna ?t=... ekleyerek Cache Busting yapıyoruz.
      // Bu sayede resim ismi aynı olsa bile tarayıcı tazesini indirir.
      this.finalUrl = `${this.baseApiUrl}${cleanUrl}?t=${new Date().getTime()}`;
    }
  }

  onImageError(event: any) {
    // CSS ile gizlemek yerine Angular kontrolü kullanıyoruz
    this.hasError = true;
  }
}
