import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { SignupComponent } from './components/auth/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { NavlayoutComponent } from './layout/nav/navlayout/navlayout.component';
import { BlanklayoutComponent } from './layout/blank/blanklayout/blanklayout.component';
const routes: Routes = [
  {
    path: '',
    component: NavlayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard]
      },
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'auth',
    component: BlanklayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent
      },
      {
        path: 'signup',
        component: SignupComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
// const routes: Routes = [
//   { path: '', component: HomeComponent },
//   { path: 'products', component: HomeComponent }, // Replace with actual component when ready
//   { path: 'cart', component: HomeComponent }, // Replace with actual component when ready
//   { path: 'profile', component: HomeComponent }, // Replace with actual component when ready
//   { path: 'login', component: HomeComponent }, // Replace with actual component when ready
//   { path: 'signup', component: HomeComponent }, // Replace with actual component when ready
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
