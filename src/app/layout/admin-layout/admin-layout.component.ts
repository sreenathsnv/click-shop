import { Component } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
@Component({
   selector: 'app-admin-layout',
    templateUrl: './admin-layout.component.html',
  standalone:false,
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ height: 0, opacity: 0 }),
        animate('300ms ease-in-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1 }),
        animate('300ms ease-in-out', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
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

