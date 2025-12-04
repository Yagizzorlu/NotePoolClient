import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ProfileRoutingModule } from './profile-routing.module'; // <--- Routing Burada

// Pages
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';

// Components
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { ProfileStatsComponent } from './components/profile-stats/profile-stats.component';
import { ProfileTabsComponent } from './components/profile-tabs/profile-tabs.component';
import { ActivityListComponent } from './components/activity-list/activity-list.component';
import { SharedModule } from '../../../shared/shared.module';

@NgModule({
  declarations: [
    // Pages
    ProfilePageComponent,
    ProfileEditComponent,

    // Components
    ProfileHeaderComponent,
    ProfileStatsComponent,
    ProfileTabsComponent,
    ActivityListComponent
  ],
  imports: [
    CommonModule,
    SharedModule, // NoteCard, Avatar, Pagination için şart
    ProfileRoutingModule, // Rotaları buradan alıyor
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProfileModule { }
