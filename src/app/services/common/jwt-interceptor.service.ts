import { Injectable, Inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JwtInterceptorService implements HttpInterceptor {

  constructor(@Inject("baseUrl") private baseUrl: string) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    
    // 1. Token'ı LocalStorage'dan al
    const token = localStorage.getItem("accessToken");

    // 2. Güvenlik Kontrolü: Sadece bizim API'ye giden isteklere token ekle
    const isApiUrl = request.url.startsWith(this.baseUrl);

    if (token && isApiUrl) {
      // 3. GET isteklerinde Content-Type header'ını kaldır (415 hatası önlemek için)
      if (request.method === 'GET') {
        // GET isteklerinde Content-Type header'ını kaldır ve sadece Authorization ekle
        let headers = request.headers;
        // Content-Type header'ı varsa kaldır
        if (headers.has('Content-Type')) {
          headers = headers.delete('Content-Type');
        }
        // Authorization header'ını ekle
        headers = headers.set('Authorization', `Bearer ${token}`);
        
        request = request.clone({
          headers: headers
        });
      } else {
        // POST, PUT, DELETE için normal şekilde header ekle
        request = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    }

    return next.handle(request);
  }
}