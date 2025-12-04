import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/common/auth.service';

@Component({
  selector: 'app-forbidden',
  templateUrl: './forbidden.component.html',
  styleUrls: ['./forbidden.component.scss']
})
export class ForbiddenComponent {

  constructor(
    private location: Location,
    private router: Router,
    private authService: AuthService
  ) {}

  goBack() {
    this.location.back();
  }

  goHome() {
    this.router.navigate(['/']);
  }

  // Bazen kullanıcı yanlış hesapla girmiştir, çıkış yapıp admin girmek ister.
  switchAccount() {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }
}

