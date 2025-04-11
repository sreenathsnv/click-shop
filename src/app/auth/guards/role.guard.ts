import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/service/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.authService.getCurrentUser();
    const requiredRoles = route.data['roles'] as Array<string>;
    
    if (!currentUser) {
      return this.router.createUrlTree(['/auth/login']);
    }
    
    if (requiredRoles && requiredRoles.some(role => currentUser.role.includes(role))) {
      return true;
    }
    
    // Redirect to unauthorized page or appropriate dashboard based on user role
    if (currentUser.role.includes('ADMIN')) {
      return this.router.createUrlTree(['/admin/dashboard']);
    }
    
    if (currentUser.role.includes('CUSTOMER')) {
      return this.router.createUrlTree(['/home']);
    }
    
    return this.router.createUrlTree(['/unauthorized']);
  }
}