import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { User, AuthResponse } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8183/api'; 
  private TOKEN_KEY = 'auth_token';
  private USER_INFO_KEY = 'user_info';
  

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) {}

  signup(userData: {
    username: string,
    password: string,
    email: string,
    role: string,
    houseName: string,
    street: string,
    district: string,
    state: string,
    zipcode: string
  }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, userData);
  }
  

  login(credentials: { username: string, password: string }): Observable<User> {
    const isLocalhost= window.location.hostname === 'localhost';
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap(response => {
        if (response.token) {
          // Store JWT token in cookie with secure settings
          this.cookieService.set(this.TOKEN_KEY, response.token, 1, '/', undefined, !isLocalhost, 'Strict');
          console.log('Stored token:', this.getToken()); 
        }
      }),
      switchMap(() => this.getUserDetails())
    );
  }


  resetPassword(email: string, newPassword: string): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/reset-password`, null, {
      params: { email, newPassword }
    });
  }
  
  getUserDetails(): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.getToken()}` 
    });
  
    
    return this.http.get<User>(`${this.apiUrl}/auth/profile`, { headers }).pipe(
      tap(user => {

        console.log(user)
        // Store user info in cookie
        this.cookieService.set(this.USER_INFO_KEY, JSON.stringify(user), 1, '/', undefined, true, 'Strict');
        
      })
    );
  }

  logout(): void {
    this.cookieService.delete(this.TOKEN_KEY);
    this.cookieService.delete(this.USER_INFO_KEY);
    this.router.navigate(['/auth/login']);
  }

  redirectBasedOnRole(user: User): void {
    if (user.role.includes('ADMIN')) {
      this.router.navigate(['/admin/dashboard']);
    } else if (user.role.includes('CUSTOMER')) {
      this.router.navigate(['/home']);
    } else {
      // Default route if no specific role is matched
      this.router.navigate(['/dashboard']);
    }
  }

  getToken(): string {
    return this.cookieService.get(this.TOKEN_KEY);
  }

  getCurrentUser(): User | null {
    const userJson = this.cookieService.get(this.USER_INFO_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
