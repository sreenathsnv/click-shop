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
import { ProductViewConsoleComponent } from './components/admin/product/product-view-console/product-view-console.component';
import { ProductAddConsoleComponent } from './components/admin/product/product-add-console/product-add-console.component';
import { ProductUpdateConsoleComponent } from './components/admin/product/product-update-console/product-update-console.component';
import { OrderViewConsoleComponent } from './components/admin/order/order-view-console/order-view-console.component';
import { DashboardConsoleComponent } from './components/admin/dashboard-console/dashboard-console.component';

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
      {
        path: '',
        component: DashboardConsoleComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'users/update',
        component: UpdateUserDetailsComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'products/view',
        component: ProductViewConsoleComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] },
      },
        {
        path: 'products/add',
        component: ProductAddConsoleComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] },
      },
       {
        path: 'product/:id/update',
        component: ProductUpdateConsoleComponent,
        canActivate: [AuthGuard, RoleGuard],
        data: { roles: ['ADMIN'] },
      },
      {
        path: 'orders/view',
        component: OrderViewConsoleComponent,
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