import { Component } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';

@Component({ selector: 'app-admin-layout', templateUrl: './admin-layout.component.html' })
export class AdminLayoutComponent {
  constructor(private auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}

