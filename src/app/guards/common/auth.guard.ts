import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../services/ui/custom-toastr.service';
import { NgxSpinner, NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from '../../base/base.component';
import { _isAuthenticated, AuthService } from '../../services/common/auth.service';



export const authGuard: CanActivateFn = (route, state) => {
  const spinner: NgxSpinnerService = inject(NgxSpinnerService);
  const toastrService: CustomToastrService = inject(CustomToastrService);
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  spinner.show(SpinnerType.BallAtom);

  if(!_isAuthenticated) {
    router.navigate(["login"], {queryParams : {returnUrl : state.url}});
    toastrService.message("Oturum Açmanız Gerekiyor!", "Yetkisiz Erişim", {
      messageType : ToastrMessageType.Warning,
      position : ToastrPosition.TopRight
    })
  }

  spinner.hide(SpinnerType.BallAtom);
  return true;
};
