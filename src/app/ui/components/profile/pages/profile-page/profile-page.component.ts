import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { HttpErrorResponse } from '@angular/common/http';
import { UserProfileDto } from '../../../../../contracts/user-profile-dto';
import { ActivityType } from '../../components/activity-list/activity-list.component';
import { UserService } from '../../../../../services/common/models/user.service';
import { SpinnerType } from '../../../../../base/base.component';
import { AuthService } from '../../../../../services/common/auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../../../services/ui/custom-toastr.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrls: ['./profile-page.component.scss']
})
export class ProfilePageComponent implements OnInit {

  userProfile: UserProfileDto | null = null;
  
  // State
  isLoading: boolean = true;
  hasError: boolean = false;
  errorMessage: string = '';
  isOwner: boolean = false; // Kendi profilim mi?
  activeTab: ActivityType = 'notes'; // Varsayılan sekme

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private toastr: CustomToastrService
  ) {}

  ngOnInit(): void {
    // URL değiştiğinde (Örn: Başkasının profilinden kendi profiline tıklarsan) tetiklenir
    this.route.params.subscribe(params => {
      const userId = params['id'];
      this.loadProfile(userId);
    });
  }

  async loadProfile(userId?: string) {
    this.isLoading = true;
    this.hasError = false;
    this.errorMessage = '';
    this.spinner.show(SpinnerType.BallScale);

    try {
      // SENIOR LOGIC: ID var mı yok mu?
      // userId undefined, null, veya boş string ise kendi profilim
      if (userId && userId.trim() !== '' && userId !== 'undefined' && userId !== 'null') {
        // 1. Başkasının Profili (Public)
        // Önce şuna bakalım: URL'deki ID benim ID'm mi?
        const myId = this.authService.currentUserId;
        this.isOwner = (myId !== null && myId === userId);

        // Veriyi çek
        this.userProfile = await this.userService.getPublicProfile(userId);
      } else {
        // 2. Kendi Profilim (/profile)
        this.isOwner = true;
        this.userProfile = await this.userService.getMyProfile();
      }
      
      // Eğer başkasının profilindeysek ve "İndirdiklerim" sekmesi seçiliyse, 
      // bunu "Notlar"a zorla (Çünkü başkasının indirmelerini göremezsin)
      if (!this.isOwner && (this.activeTab === 'downloads')) {
        this.activeTab = 'notes';
      }

    } catch (error) {
      console.error("Profil yüklenemedi", error);
      this.hasError = true;
      
      // HTTP Error kontrolü
      if (error instanceof HttpErrorResponse) {
        if (error.status === 404) {
          this.errorMessage = "Kullanıcı profili bulunamadı.";
          this.toastr.message("Görüntülemek istediğiniz kullanıcı profili mevcut değil.", "Profil Bulunamadı", {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopRight
          });
          
          // 3 saniye sonra ana sayfaya yönlendir
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        } else if (error.status === 401 || error.status === 403) {
          this.errorMessage = "Bu profili görüntüleme yetkiniz yok.";
          this.toastr.message("Bu profili görüntüleme yetkiniz bulunmamaktadır.", "Yetki Hatası", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopRight
          });
        } else {
          this.errorMessage = "Profil yüklenirken bir hata oluştu.";
          this.toastr.message("Profil bilgileri yüklenirken bir sorun oluştu. Lütfen tekrar deneyin.", "Hata", {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopRight
          });
        }
      } else {
        this.errorMessage = "Beklenmeyen bir hata oluştu.";
        this.toastr.message("Bir hata oluştu. Lütfen sayfayı yenileyin.", "Hata", {
          messageType: ToastrMessageType.Error,
          position: ToastrPosition.TopRight
        });
      }
    } finally {
      this.isLoading = false;
      this.spinner.hide(SpinnerType.BallScale);
    }
  }

  // --- EVENT HANDLERS ---

  onTabChange(tab: ActivityType) {
    this.activeTab = tab;
  }

  // Header'dan gelen "Avatar Değişti" eventi
  onAvatarChanged(newUrl: string) {
    if (this.userProfile) {
      this.userProfile.profileImage = newUrl;
      // Navbar'daki avatarı da güncellemek gerekebilir, 
      // AuthService üzerinden bir Subject yayınlayabiliriz.
    }
  }
}
