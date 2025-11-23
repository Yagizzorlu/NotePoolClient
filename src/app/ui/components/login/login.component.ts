import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/common/models/user.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from '../../../base/base.component';
import { AuthService } from '../../../services/common/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { HttpClientService } from '../../../services/common/http-client.service';
import { TokenResponse } from '../../../contracts/tokenResponse';
import { UserAuthService } from '../../../services/common/models/user-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent extends BaseComponent implements OnInit {

  constructor(private userService: UserService, spinner: NgxSpinnerService, private authService: AuthService,
    private activatedRoute: ActivatedRoute, private router: Router, private socialAuthService: SocialAuthService, private userAuthService: UserAuthService
  ) {
    super(spinner)
    // --- GOOGLE LOGIN İŞLEMİ ---
    socialAuthService.authState.subscribe(async (user: SocialUser) => {
      console.log(user);
      this.showSpinner(SpinnerType.BallAtom);
      await userAuthService.googleLogin(user, () => {
        this.authService.identityCheck();
        this.hideSpinner(SpinnerType.BallAtom);
        
        // Google login başarılı olunca ana sayfaya yönlendir
        this.redirectToUrlOrHome(); 
      })
    });
  }

  ngOnInit(): void {
  }

  // --- NORMAL LOGIN İŞLEMİ ---
  async login(userNameOrEmail: string, password: string) {
    this.showSpinner(SpinnerType.BallAtom);
    await this.userAuthService.login(userNameOrEmail, password, () => {
      this.authService.identityCheck();
      
      // Login başarılı olunca yönlendirme fonksiyonunu çağır
      this.redirectToUrlOrHome();

      this.hideSpinner(SpinnerType.BallAtom);
    });
  }

  // Kod tekrarını önlemek için yönlendirme mantığını buraya aldım
  private redirectToUrlOrHome() {
    this.activatedRoute.queryParams.subscribe(params => {
      const returnUrl: string = params["returnUrl"];
      if (returnUrl) {
        // Eğer kullanıcı korumalı bir sayfadan geldiyse oraya geri dön
        this.router.navigate([returnUrl]);
      } else {
        // Değilse ANA SAYFAYA GİT (Eklenen Kısım)
        this.router.navigate(["/"]);
      }
    });
  }

  signInWithGoogle() {
    const hiddenBtn = document.getElementById('hidden-google-btn');
    if (hiddenBtn) {
      const googleButton = hiddenBtn.querySelector('div[role="button"]') as HTMLElement;
      if (googleButton) {
        googleButton.click();
      } else {
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