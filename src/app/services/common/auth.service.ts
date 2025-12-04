import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // Reactive State
  private _isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this._isAuthenticatedSubject.asObservable();

  constructor(
    private jwtHelper: JwtHelperService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.identityCheck();
  }

  identityCheck() {
    if (!isPlatformBrowser(this.platformId)) {
        this._isAuthenticatedSubject.next(false);
        return;
    }

    const token = localStorage.getItem("accessToken");

    if (!token) {
        this._isAuthenticatedSubject.next(false);
        return;
    }

    let expired: boolean;
    try {
      expired = this.jwtHelper.isTokenExpired(token);
    } catch {
      expired = true;
    }

    this._isAuthenticatedSubject.next(!expired);
  }

  get isAuthenticated(): boolean {
    return this._isAuthenticatedSubject.value;
  }
  
  // --- SENIOR DOKUNUŞU: USER ID GETTER ---
  // Token'ı decode edip içindeki ID'yi okur.
  get currentUserId(): string | null {
    if (!isPlatformBrowser(this.platformId)) return null;
    
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      
      // JWT Claim Mapping
      // NameIdentifier bazen URL şemasıyla, bazen kısa adıyla gelir. İkisini de kontrol ediyoruz.
      return decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] 
             || decodedToken["nameid"] 
             || decodedToken["sub"] 
             || null;
             
    } catch (error) {
      return null;
    }
  }

  signOut() {
      if (isPlatformBrowser(this.platformId)) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
      this.identityCheck(); 
  }
}

