import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, Observable, of } from 'rxjs';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../ui/custom-toastr.service';
import { UserAuthService } from './models/user-auth.service';


@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor{

  constructor(
    private toastrService : CustomToastrService, 
    private userAuthService : UserAuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(error => {
      switch(error.status) {
        case HttpStatusCode.Unauthorized:
          this.toastrService.message("Bu İşlemi Yapmaya Yetkiniz Yok", "Yetkisiz İşlem", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopRight
          });

          const refreshToken = isPlatformBrowser(this.platformId) ? localStorage.getItem("refreshToken") : null;
          if (refreshToken) {
            this.userAuthService.refreshTokenLogin(refreshToken).then(data => {
              
            });
          }
          break;

        case HttpStatusCode.InternalServerError:
          this.toastrService.message("Sunucuya Erişilmiyor", "Sunucu Hatası", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopRight
          });
          break;

        case HttpStatusCode.BadRequest:
          this.toastrService.message("Geçersiz İstek Yapıldı", "Geçersiz İstek", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopRight
          });
          break;

        case HttpStatusCode.NotFound:
          this.toastrService.message("Sayfa Bulunamadı", "Sayfa Bulunamadı", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopRight
          });
          break;

        default:
          this.toastrService.message("Beklenmeyen Hata Meydana Geldi", "Hata", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopRight
          });
          break;
      }
      return of(error);
    }));
    
  }
}
