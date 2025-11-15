import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfilesComponent } from './profiles.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ProfilesComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
          {path:"", component : ProfilesComponent}
        ])
  ]
})
export class ProfilesModule { }
