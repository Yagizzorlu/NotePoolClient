import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpStatusCode } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, Observable, throwError } from 'rxjs';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/custom-toastr.service'; // Yolunu kontrol et

@Injectable({
  providedIn: 'root'
})
export class HttpErrorHandlerInterceptorService implements HttpInterceptor {

  constructor(
    private toastrService: CustomToastrService,
    private injector: Injector,
    private router: Router
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    return next.handle(req).pipe(catchError(error => {
      
      switch (error.status) {
        case HttpStatusCode.Unauthorized: // 401 Hatası (Token geçersiz/yok)
          
          // 1. Kullanıcıya bilgi ver
          this.toastrService.message("Oturumunuzun süresi doldu. Lütfen tekrar giriş yapınız.", "Oturum Kapandı", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopRight
          });

          // 2. Eski tokenları temizle (Çok önemli, yoksa sonsuz döngü olur)
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          
          // 3. Login sayfasına yönlendir
          // AppRouting'de "login" -> "auth/login" yönlendirmesi olduğu için bu çalışır.
          this.router.navigate(["/login"]); 
          break;

        case HttpStatusCode.Forbidden: // 403 Hatası (Yetki yok)
          this.toastrService.message("Bu işlem için yetkiniz bulunmuyor.", "Erişim Engellendi", {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopRight
          });
          break;

        case HttpStatusCode.InternalServerError: // 500 Hatası
          this.toastrService.message("Sunucu şu an yanıt veremiyor.", "Sunucu Hatası", {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopRight
          });
          break;

        case HttpStatusCode.BadRequest: // 400 Hatası
          const message = error.error?.message || "Geçersiz istek yapıldı.";
          this.toastrService.message(message, "Hata", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopRight
          });
          break;

        case HttpStatusCode.NotFound: // 404 Hatası
          this.toastrService.message("İstenilen kayıt bulunamadı.", "Bulunamadı", {
            messageType: ToastrMessageType.Warning,
            position: ToastrPosition.TopRight
          });
          break;

        default:
          this.toastrService.message("Beklenmeyen bir hata oluştu.", "Hata", {
            messageType: ToastrMessageType.Error,
            position: ToastrPosition.TopRight
          });
          break;
      }

      // Hatayı fırlat ki component haberdar olsun (Spinner kapansın vs.)
      return throwError(() => error); 
    }));
  }
}
