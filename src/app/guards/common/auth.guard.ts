import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';



export const authGuard: CanActivateFn = (route, state) => {

  const jwtHelper : JwtHelperService = inject(JwtHelperService);

  const token : string = localStorage.getItem("accessToken");

  const decodeToken = jwtHelper.decodeToken(token);

  const expirationDate : Date = jwtHelper.getTokenExpirationDate(token);

  const expired : boolean = jwtHelper.isTokenExpired(token);

  return true;
};
