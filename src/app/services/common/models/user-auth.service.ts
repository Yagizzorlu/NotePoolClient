import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { SocialUser } from '@abacritt/angularx-social-login';
import { HttpClientService } from '../http-client.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { LoginRequest } from '../../../contracts/login-request';
import { TokenResponse } from '../../../contracts/token-response';



@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(
    private httpClientService: HttpClientService,
    private toastrService: CustomToastrService
  ) { }

  async login(loginRequest: LoginRequest, callBackFunction?: () => void): Promise<void> {
    const observable: Observable<TokenResponse> = this.httpClientService.post<TokenResponse>({
      controller: "auth",
      action: "login"
    }, loginRequest);

    try {
      const tokenResponse: TokenResponse = await firstValueFrom(observable);
      
      if (tokenResponse && tokenResponse.token) {
        localStorage.setItem("accessToken", tokenResponse.token.accessToken);
        localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
        
        this.toastrService.message("Kullanıcı Girişi Başarıyla Sağlanmıştır", "Giriş Başarılı", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        });
        
        callBackFunction?.(); // Varsa çağır
      }
    } catch (error) {
    }
  }

  async refreshTokenLogin(refreshToken: string, callBackFunction?: (state: boolean) => void): Promise<any> {
    const observable: Observable<TokenResponse> = this.httpClientService.post<TokenResponse>({
      action: "refreshtokenlogin",
      controller: "auth"
    }, { refreshToken: refreshToken });

    try {
      const tokenResponse: TokenResponse = await firstValueFrom(observable);
      
      if (tokenResponse && tokenResponse.token) {
        localStorage.setItem("accessToken", tokenResponse.token.accessToken);
        localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
        callBackFunction?.(true); // Başarılı
      } else {
        callBackFunction?.(false); // Başarısız
      }
    } catch {
      callBackFunction?.(false);
    }
  }

  async googleLogin(user: SocialUser, callBackFunction?: () => void): Promise<void> {
    const observable: Observable<TokenResponse> = this.httpClientService.post<TokenResponse>({
      action: "google-login",
      controller: "auth"
    }, user);

    try {
      const tokenResponse: TokenResponse = await firstValueFrom(observable);

      if (tokenResponse && tokenResponse.token) {
        localStorage.setItem("accessToken", tokenResponse.token.accessToken);
        localStorage.setItem("refreshToken", tokenResponse.token.refreshToken);
        
        this.toastrService.message("Google üzerinden giriş başarıyla sağlanmıştır", "Giriş Başarılı", {
          messageType: ToastrMessageType.Success,
          position: ToastrPosition.TopRight
        });
        
        callBackFunction?.();
      }
    } catch (error) {
       // Google login hatası
    }
  }
}

