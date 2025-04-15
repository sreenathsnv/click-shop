// src/app/app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/guards/auth.guard';
import { RoleGuard } from './auth/guards/role.guard';
import { SignupComponent } from './components/auth/signup/signup.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { NavlayoutComponent } from './layout/nav/navlayout/navlayout.component';
import { BlanklayoutComponent } from './layout/blank/blanklayout/blanklayout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { UpdateUserDetailsComponent } from './components/admin/update-user-details/update-user-details.component';

const routes: Routes = [
  {
    path: '',
    component: NavlayoutComponent,
    children: [
      {
        path: 'home',
        component: HomeComponent,
        canActivate: [AuthGuard],
      },
      {
        path: '',
        component: HomeComponent,
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'auth',
    component: BlanklayoutComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
      },
      {
        path: 'signup',
        component: SignupComponent,
      },
    ],
  },
  {
    path: 'admin/dashboard',
    component: AdminLayoutComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: '', redirectTo: 'users/view', pathMatch: 'full' },
      {
        path: 'users/view',
        component: UserManagementComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'users/update',
        component: UpdateUserDetailsComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] },
      },
      // {
      //   path: 'products',
      //   component: ProductManagementComponent,
      //   canActivate: [AuthGuard, RoleGuard],
      //   data: { roles: ['ADMIN'] },
      // },
      // {
      //   path: 'orders',
      //   component: OrderManagementComponent,
      //   canActivate: [AuthGuard, RoleGuard],
      //   data: { roles: ['ADMIN'] },
      // },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}