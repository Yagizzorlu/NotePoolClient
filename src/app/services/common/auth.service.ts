import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private jwtHelper : JwtHelperService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }
  identityCheck() {
    const token : string = isPlatformBrowser(this.platformId) ? localStorage.getItem("accessToken") : null;
  //const decodeToken = jwtHelper.decodeToken(token);
  //const expirationDate : Date = jwtHelper.getTokenExpirationDate(token);

  let expired: boolean;
  try {
    expired = this.jwtHelper.isTokenExpired(token);
  } catch {
    expired = true;
  }
  _isAuthenticated = token != null && !expired



  }

  get isAuthenticated() : boolean {
    return _isAuthenticated;
  }

}

export let _isAuthenticated: boolean;
