import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './admin/layout/layout.component';
import { DashboardComponent } from './admin/components/dashboard/dashboard.component';
import { HomeComponent } from './ui/components/home/home.component';
import { authGuard } from './guards/common/auth.guard';

const routes: Routes = [
{path:"admin",component:LayoutComponent,children:[
  {path:"",component:DashboardComponent, canActivate : [authGuard]},
  {path:"comments",loadChildren: () => import("./admin/components/comments/comments.module")
    .then(module=>module.CommentsModule), canActivate : [authGuard] },
   {path:"courses",loadChildren: () => import("./admin/components/courses/courses.module")
    .then(module=>module.CoursesModule ), canActivate : [authGuard] },
   {path:"institutions",loadChildren: () => import("./admin/components/institutions/institutions.module")
    .then(module=>module.InstitutionsModule ), canActivate : [authGuard] },
    {path:"notes",loadChildren: () => import("./admin/components/notes/notes.module")
    .then(module=>module.NotesModule ), canActivate : [authGuard] },
    {path:"users",loadChildren: () => import("./admin/components/users/users.module")
    .then(module=>module.UsersModule ), canActivate : [authGuard] },  
], canActivate : [authGuard]
},

{path:"",component:HomeComponent},
{path:"bookmarks",loadChildren: () => import("./ui/components/bookmarks/bookmarks.module")
    .then(module=>module.BookmarksModule ) },
{path:"notes",loadChildren: () => import("./ui/components/notes/notes.module")
    .then(module=>module.NotesModule ) },    
{path:"notes-detail",loadChildren: () => import("./ui/components/notes-detail/notes-detail.module")
    .then(module=>module.NotesDetailModule ) },
{path:"notes-upload",loadChildren: () => import("./ui/components/notes-upload/notes-upload.module")
    .then(module=>module.NotesUploadModule ) },
{path:"profiles",loadChildren: () => import("./ui/components/profiles/profiles.module")
    .then(module=>module.ProfilesModule ) },
{path:"register",loadChildren: () => import("./ui/components/register/register.module")
    .then(module=>module.RegisterModule ) },
{path:"login",loadChildren: () => import("./ui/components/login/login.module")
    .then(module=>module.LoginModule ) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
