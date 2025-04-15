import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';

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
    UserDetailsPipePipe
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule
  ],
  providers: [
    provideClientHydration(withEventReplay()),
    CookieService,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
