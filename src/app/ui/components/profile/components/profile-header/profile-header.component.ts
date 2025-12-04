import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UserProfileDto } from '../../../../../contracts/user-profile-dto';
import { UserService } from '../../../../../services/common/models/user.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../../../services/ui/custom-toastr.service';
import { FileUploadDialogComponent } from '../../../../../dialogs/file-upload-dialog/file-upload-dialog.component';
import { DialogService } from '../../../../../services/common/dialog.service';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss']
})
export class ProfileHeaderComponent {

  @Input() user!: UserProfileDto;
  @Input() isOwner: boolean = false; // Kendi profilim mi?

  // Avatar değişirse üst componente (Page) haber verip yenileteceğiz
  @Output() avatarChanged = new EventEmitter<string>(); 

  constructor(
    private dialogService: DialogService,
    private userService: UserService,
    private toastr: CustomToastrService
  ) {}

  // 1. AVATAR YÜKLEME (Dialog ile)
  openAvatarUpload() {
    if (!this.isOwner) return;

    this.dialogService.openDialog({
      componentType: FileUploadDialogComponent,
      data: {
        title: "Profil Fotoğrafını Değiştir",
        multiple: false, // Sadece 1 resim
        accept: ".jpg,.jpeg,.png,.webp"
      },
      afterClosed: () => {
        // DialogService refactor'ünde callback yerine Observable yapısı kurmuştuk ama
        // FileUploadDialog kendi içinde [mat-dialog-close]="files" dönüyor.
        // DialogService'in 'openDialog' metodu bu datayı bize dönmüyorsa (void ise),
        // MatDialog'un kendisini kullanmak veya servisi güncellemek gerekebilir.
        // *Senior Pratiklik:* DialogService'in bu versiyonunda result'ı yakalamak zor olabilir,
        // bu yüzden FileUploadDialog içinden bir event fırlatmak veya MatDialogRef kullanmak daha temizdir.
        // Ancak şimdilik basit bir input file tetikleyicisi (HTML tarafında) en sağlamıdır.
      }
    });
  }

  // 2. ALTERNATİF: HIZLI YÜKLEME (Direkt Input)
  // Dialog açmak yerine direkt dosya seçtirmek UX açısından bazen daha hızlıdır.
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadAvatar(file);
    }
  }

  async uploadAvatar(file: File) {
    try {
      const response = await this.userService.uploadProfileImage(file);
      
      if (response.succeeded) {
        this.toastr.message("Profil fotoğrafınız güncellendi.", "Başarılı", { 
          messageType: ToastrMessageType.Success, 
          position: ToastrPosition.TopRight 
        });
        
        // UI'ı anında güncelle
        this.user.profileImage = response.newProfileImageUrl;
        this.avatarChanged.emit(response.newProfileImageUrl);
      }
    } catch (error) {
      // Hata interceptor'da
    }
  }
}

