import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LoadingInterceptorService implements HttpInterceptor {
  
  private totalRequests = 0;

  constructor(private spinner: NgxSpinnerService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    
    this.totalRequests++;
    
    // Spinner Başlat (s1 ismini app.component.html'deki tanımla eşleşmesi için kullanabilirsin,
    // şimdilik undefined bırakıyorum varsayılanı tetikler, type'ı override eder.)
    this.spinner.show(undefined, {
      type: "ball-atom",
      size: "medium",
      bdColor: "rgba(0, 0, 0, 0.8)",
      color: "#fff",
      fullScreen: true
    });

    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        
        // Sadece tüm istekler bittiyse kapat
        if (this.totalRequests === 0) {
          this.spinner.hide();
        }
      })
    );
  }
}