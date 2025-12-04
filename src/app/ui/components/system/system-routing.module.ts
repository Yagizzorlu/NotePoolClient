import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Components
import { NotFoundComponent } from './not-found/not-found.component';
import { ForbiddenComponent } from './forbidden/forbidden.component';

const routes: Routes = [
  { 
    path: 'not-found', 
    component: NotFoundComponent,
    data: { title: 'Sayfa Bulunamadı' }
  },
  { 
    path: 'forbidden', 
    component: ForbiddenComponent,
    data: { title: 'Erişim Engellendi' }
  },
  // Eğer biri direkt '/system' yazarsa 404'e atalım
  { 
    path: '', 
    redirectTo: 'not-found', 
    pathMatch: 'full' 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemRoutingModule { }
