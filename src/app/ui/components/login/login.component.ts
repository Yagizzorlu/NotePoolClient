import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { AuthService } from '../../../services/common/auth.service';
import { UserAuthService } from '../../../services/common/models/user-auth.service';
import { LoginRequest } from '../../../contracts/login-request';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {

  returnUrl: string = '/';

  constructor(
    spinner: NgxSpinnerService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private socialAuthService: SocialAuthService,
    private userAuthService: UserAuthService
  ) {
    super(spinner);

    // --- GOOGLE LOGIN İŞLEMİ (Constructor Listener) ---
    this.socialAuthService.authState.subscribe(async (user: SocialUser) => {
      if (user) {
        this.showSpinner(SpinnerType.BallAtom);
        
        await this.userAuthService.googleLogin(user, () => {
          this.authService.identityCheck();
          this.hideSpinner(SpinnerType.BallAtom);
          this.router.navigate([this.returnUrl]);
        });
      }
    });
  }

  ngOnInit(): void {
    // Return URL'i subscribe ile alıyoruz (Component yüklendiğinde)
    this.activatedRoute.queryParams.subscribe(params => {
      // Login Guard'dan (AuthGuard) gelen 'returnUrl' parametresini yakalar
      this.returnUrl = params["returnUrl"] || "/";
    });
  }

  // --- NORMAL LOGIN İŞLEMİ (Template Driven/Template Reference) ---
  async login(userNameOrEmail: string, password: string) {
    this.showSpinner(SpinnerType.BallAtom);

    const request: LoginRequest = {
      userNameOrEmail: userNameOrEmail,
      password: password
    };

    // UserAuthService'in başarılı callback'i
    await this.userAuthService.login(request, () => {
      this.authService.identityCheck();
      this.hideSpinner(SpinnerType.BallAtom);
      
      // Başarılı olunca kaydedilen rotaya yönlendir
      this.router.navigate([this.returnUrl]);
    });
    // Hata durumunda spinner'ı Interceptor kapatır.
  }

  // Google butonuna tıklanınca gizli butonu tetikleyen DOM hack'i
  signInWithGoogle() {
    const hiddenBtn = document.getElementById('hidden-google-btn');
    if (hiddenBtn) {
      const googleButton = hiddenBtn.querySelector('div[role="button"]') as HTMLElement;
      if (googleButton) {
        googleButton.click();
      } else {
        // ... Buton render gecikmesi için retry mantığı (kalsın)
        setTimeout(() => {
          const btn = hiddenBtn.querySelector('div[role="button"]') as HTMLElement;
          if (btn) {
            btn.click();
          }
        }, 200);
      }
    }
  }
}