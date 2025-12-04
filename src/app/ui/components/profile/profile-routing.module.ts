import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Pages
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';
import { authGuard } from '../../../guards/common/auth.guard';

const routes: Routes = [
  { 
    path: 'edit', 
    component: ProfileEditComponent,
    canActivate: [authGuard], // Sadece giriş yapmış kullanıcı girebilir
    data: { title: 'Profili Düzenle' }
  },

  // 2. Başkasının Profili (/profile/gu-id-str-ing)
  { 
    path: ':id', 
    component: ProfilePageComponent,
    data: { title: 'Kullanıcı Profili' }
  },

  // 3. Kendi Profilim (/profile)
  { 
    path: '', 
    component: ProfilePageComponent,
    canActivate: [authGuard], // Giriş yapmamışsa buraya giremez
    pathMatch: 'full',
    data: { title: 'Profilim' }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }

