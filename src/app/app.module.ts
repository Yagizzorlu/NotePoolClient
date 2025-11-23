import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AdminModule } from './admin/admin.module';
import { UiModule } from './ui/ui.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MatDialogContent, MatDialogActions, MatDialogClose } from "@angular/material/dialog";
import { ReactiveFormsModule } from '@angular/forms';
import { JwtModule } from '@auth0/angular-jwt';
import { LoginComponent } from './ui/components/login/login.component';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from '@abacritt/angularx-social-login';
import { HttpErrorHandlerInterceptorService } from './services/common/http-error-handler-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    //LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AdminModule, UiModule,
    ToastrModule.forRoot({
        timeOut: 3000,
        tapToDismiss: true
    }),
    NgxSpinnerModule,
    HttpClientModule,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    ReactiveFormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          if (typeof window !== 'undefined' && window.localStorage) {
            return localStorage.getItem("accessToken");
          }
          return null;
        },
        allowedDomains:["localhost:7111"],
      }
    }),
    SocialLoginModule
],
  providers: [
    provideClientHydration(),
    provideAnimationsAsync(),
    {provide: "baseUrl", useValue: 'https://localhost:7111/api', multi : true},
    {
      provide: "SocialAuthServiceConfig",
      useValue : {
        autoLogin : false,
        providers : [ 
          {
            id : GoogleLoginProvider.PROVIDER_ID,
            provider : new GoogleLoginProvider("456347705498-b44onnnbue9v3icnin334bsansunsh3d.apps.googleusercontent.com") 
        }
        ],
        onError : err => console.log(err)
      } as SocialAuthServiceConfig
    },
    {provide: HTTP_INTERCEPTORS, useClass:HttpErrorHandlerInterceptorService, multi : true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
