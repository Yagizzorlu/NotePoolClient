import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, Observable, catchError, throwError } from 'rxjs';
import { Create_User } from '../../../contracts/create_user';
import { User } from '../../../entities/user';
import { HttpClientService } from './../http-client.service';
import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { Token } from '../../../contracts/token';
import { TokenResponse } from '../../../contracts/tokenResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService : HttpClientService, private ToastrService : CustomToastrService) { }

  async create(user : User) : Promise<Create_User> {
    const observable : Observable<Create_User | User> = this.httpClientService.post<Create_User | User>({
      controller : "users",
      action : "register"
    }, user).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => error);
      })
    );

    return await firstValueFrom(observable) as Create_User;
  }

  async login(userNameOrEmail : string, password : string, callBackFunction?: () => void) : Promise<any> {
    const observable : Observable<any | TokenResponse> = this.httpClientService.post<any | TokenResponse> ({
      controller : "users",
      action : "login"
    }, {userNameOrEmail , password})

    const tokenResponse : TokenResponse = await firstValueFrom(observable) as TokenResponse;
    if(tokenResponse) {
      localStorage.setItem("accessToken", tokenResponse.token.accessToken);

      this.ToastrService.message("Kullanıcı Girişi Başarıyla Sağlanmıştır","Giriş Başarılı", {
       messageType: ToastrMessageType.Success,
       position: ToastrPosition.TopRight
      })
    }
    callBackFunction();
  }
}
