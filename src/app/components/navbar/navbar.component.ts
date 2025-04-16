import { Component } from '@angular/core';
import { AuthService } from '../../auth/service/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isMenuOpen = false;
  brandColor = '#FFA725';
  isLoggedIn:boolean;
  userRole:string  = "";
  cartItemCount:number=0;

  constructor(private authService:AuthService,
    private cookieService: CookieService,
    private router: Router
  ){
    this.isLoggedIn = this.authService.isLoggedIn();
    authService.getUserDetails().subscribe(data=>
      this.userRole = data.role
    )
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }
  adjustBrightness(hex: string, percent: number): string {
    // Convert hex to RGB
    let r = parseInt(hex.substring(1, 3), 16);
    let g = parseInt(hex.substring(3, 5), 16);
    let b = parseInt(hex.substring(5, 7), 16);

    // Adjust brightness
    r = Math.max(0, Math.min(255, r + (percent * 2.55)));
    g = Math.max(0, Math.min(255, g + (percent * 2.55)));
    b = Math.max(0, Math.min(255, b + (percent * 2.55)));

    // Convert back to hex
    const rHex = Math.round(r).toString(16).padStart(2, '0');
    const gHex = Math.round(g).toString(16).padStart(2, '0');
    const bHex = Math.round(b).toString(16).padStart(2, '0');

    return `#${rHex}${gHex}${bHex}`;
  }

  // Get a lighter shade for backgrounds
  getLighterShade(hex: string): string {
    return this.adjustBrightness(hex, 85); // Much lighter for backgrounds
  }

  // Get a darker shade for hover states
  getDarkerShade(hex: string): string {
    return this.adjustBrightness(hex, -10); // Slightly darker for hover
  }

  logout(){
    this.authService.logout();
    this.isLoggedIn=false;
    this.router.navigate(['/']);
  }
}
