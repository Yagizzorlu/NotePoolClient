import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserService } from '../../../../../services/common/models/user.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../../../../services/ui/custom-toastr.service';
import { SpinnerType } from '../../../../../base/base.component';
import { UpdateProfileRequest } from '../../../../../contracts/update-profile-request';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss']
})
export class ProfileEditComponent implements OnInit {

  profileForm!: FormGroup;
  isLoading: boolean = true;
  isSubmitting: boolean = false;
  
  // Avatar önizleme için
  currentAvatarUrl: string | null = null;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private toastr: CustomToastrService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.loadUserData();
  }

  createForm() {
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      userName: ['', [Validators.required, Validators.minLength(3)]],
      // Email genelde değiştirilemez veya özel akış gerektirir, disabled yapıyoruz
      email: [{ value: '', disabled: true }], 
      
      // Şifre değişimi için ayrı bir alan veya modal olabilir, 
      // ama basitlik adına buraya opsiyonel ekleyebiliriz.
      // Şimdilik sadece profil bilgilerine odaklanalım.
    });
  }

  async loadUserData() {
    this.isLoading = true;
    this.spinner.show(SpinnerType.BallAtom);
    
    try {
      const user = await this.userService.getMyProfile();
      
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email
      });

      this.currentAvatarUrl = user.profileImage || null;

    } catch (error) {
      this.toastr.message("Kullanıcı bilgileri yüklenemedi.", "Hata", { messageType: ToastrMessageType.Error, position: ToastrPosition.BottomRight });
    } finally {
      this.isLoading = false;
      this.spinner.hide(SpinnerType.BallAtom);
    }
  }

  // Avatar değişimi (Header componentindeki mantıkla aynı servis kullanılır)
  async onAvatarSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.spinner.show(SpinnerType.BallAtom);
    try {
      const res = await this.userService.uploadProfileImage(file);
      if (res.succeeded) {
        this.currentAvatarUrl = res.newProfileImageUrl; // UI'ı güncelle
        this.toastr.message("Profil fotoğrafı güncellendi.", "Başarılı", { messageType: ToastrMessageType.Success, position: ToastrPosition.BottomRight });
      }
    } catch (error) {
      // Hata
    } finally {
      this.spinner.hide(SpinnerType.BallAtom);
    }
  }

  async onSubmit() {
    if (this.profileForm.invalid) return;

    this.isSubmitting = true;
    this.spinner.show(SpinnerType.BallAtom);

    try {
      const request: UpdateProfileRequest = {
        ...this.profileForm.getRawValue(),
        profileImage: this.currentAvatarUrl || undefined
      };

      const res = await this.userService.updateMyProfile(request);
      
      if (res.success) {
        this.toastr.message(res.message, "Başarılı", { messageType: ToastrMessageType.Success, position: ToastrPosition.TopRight });
        // İsteğe bağlı: Sayfayı yenile veya profil sayfasına git
        // this.router.navigate(['/profile']);
      } else {
         this.toastr.message(res.message, "Hata", { messageType: ToastrMessageType.Error, position: ToastrPosition.TopRight });
      }

    } catch (error) {
       // Hata
    } finally {
      this.isSubmitting = false;
      this.spinner.hide(SpinnerType.BallAtom);
    }
  }
}

