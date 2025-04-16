import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule,HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { ProductCardComponent } from './components/home/product-card/product-card.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { LoginComponent } from './components/auth/login/login.component';
import { AuthInterceptor } from './auth/interceptors/auth.interceptor';
import { NavlayoutComponent } from './layout/nav/navlayout/navlayout.component';
import { BlanklayoutComponent } from './layout/blank/blanklayout/blanklayout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { FormsModule } from '@angular/forms';
import { UpdateUserDetailsComponent } from './components/admin/update-user-details/update-user-details.component';
import { UserDetailsPipePipe } from './components/admin/update-user-details/user-details-pipe.pipe';
import { ProductViewConsoleComponent } from './components/admin/product/product-view-console/product-view-console.component';
import { ProductAddConsoleComponent } from './components/admin/product/product-add-console/product-add-console.component';
import { ProductUpdateConsoleComponent } from './components/admin/product/product-update-console/product-update-console.component';
import { OrderViewConsoleComponent } from './components/admin/order/order-view-console/order-view-console.component';
import { DashboardConsoleComponent } from './components/admin/dashboard-console/dashboard-console.component';
import { NgApexchartsModule } from 'ng-apexcharts';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    ProductCardComponent,
    SignupComponent,
    LoginComponent,
    NavlayoutComponent,
    BlanklayoutComponent,
    AdminLayoutComponent,
    UserManagementComponent,
    UpdateUserDetailsComponent,
    UserDetailsPipePipe,
    ProductViewConsoleComponent,
    ProductAddConsoleComponent,
    ProductUpdateConsoleComponent,
    OrderViewConsoleComponent,
    DashboardConsoleComponent
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right', 
      timeOut: 3000,
      closeButton: true,
      progressBar: true,
    }),
    NgApexchartsModule,
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
