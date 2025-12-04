import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // RouterOutlet ve RouterLink için ŞART
import { SharedModule } from '../shared/shared.module'; // UserAvatar kullanıyoruz

// Bileşenler
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { UserMenuComponent } from './user-menu/user-menu.component';

@NgModule({
  declarations: [
    MainLayoutComponent,
    NavbarComponent,
    FooterComponent,
    UserMenuComponent
  ],
  imports: [
    CommonModule,
    RouterModule, // Navigasyon için kritik
    SharedModule  // Ortak bileşenler (Avatar vb.) için
  ],
  exports: [
    MainLayoutComponent, // Routing modülünde kullanılacağı için dışarı açıyoruz
    NavbarComponent,
    FooterComponent,
    UserMenuComponent
  ]
})
export class LayoutModule { }

