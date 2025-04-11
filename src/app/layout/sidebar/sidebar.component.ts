import { Component } from '@angular/core';

type MenuKey = 'users' | 'products' | 'orders';  // ✅ Move this outside

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  expandedMenus: Record<MenuKey, boolean> = {
    users: false,
    products: false,
    orders: false,
  };

  toggleMenu(menu: MenuKey) {
    this.expandedMenus[menu] = !this.expandedMenus[menu];
  }

  logout() {
    // your logout logic
  }
}
