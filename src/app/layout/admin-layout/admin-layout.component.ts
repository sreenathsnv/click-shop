import { Component } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';

@Component({
   selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
  standalone:false
 })
export class AdminLayoutComponent {
  constructor(private auth: AuthService) {}

   sections:any = {
    users: false,
    products: false,
    orders: false
  };

  logout() {
    this.auth.logout();
  }
toggleSection(section: string): void {
    this.sections[section] = !this.sections[section];
  }
}

