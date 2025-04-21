import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError, tap, switchMap, of } from 'rxjs';
import { CartItem } from '../models/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8184/api/cart';
  private token: string | null = null;
  private cartItems = new BehaviorSubject<CartItem[]>([]); 
  private cartItems$ = this.cartItems.asObservable();

  constructor(private http: HttpClient) {
    this.token = localStorage.getItem('authToken');
    // Initialize cart items on service creation
    this.fetchCartItems().subscribe();
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: this.token ? `Bearer ${this.token}` : '',
      'Content-Type': 'application/json'
    });
  }

  // Add item to cart
  addToCart(productId: number, quantity: number): Observable<CartItem> {
    const params = { productId: productId.toString(), quantity: quantity };
    return this.http.post<CartItem>(`${this.apiUrl}/add`, null, { headers: this.getHeaders(), params }).pipe(
      tap(() => this.refreshCartItems()),
      catchError(this.handleError)
    );
  }

  // Get all cart items (returns cached items or fetches if empty)
  getCartItems(): Observable<CartItem[]> {
    return this.cartItems$.pipe(
      switchMap(items => {
        if (items.length === 0) {
          return this.fetchCartItems(); // Fetch only if cache is empty
        }
        return of(items);
      })
    );
  }

  // Remove item from cart
  removeFromCart(productId: number): Observable<void> {
    const params = { productId: productId.toString() };
    return this.http.delete<void>(`${this.apiUrl}/remove`, { headers: this.getHeaders(), params }).pipe(
      tap(() => this.refreshCartItems()), // Refresh cart after removal
      catchError(this.handleError)
    );
  }

  // Update item quantity
  updateQuantity(productId: number, quantity: number): Observable<CartItem> {
    const params = { productId: productId.toString(), quantity: quantity.toString() };
    return this.http.put<CartItem>(`${this.apiUrl}/update`, null, { headers: this.getHeaders(), params }).pipe(
      tap(() => this.refreshCartItems()), // Refresh cart after update
      catchError(this.handleError)
    );
  }

  // Get total cart amount
  getTotalAmount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/total`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Get grouped total (per item)
  getGroupedAmount(): Observable<Map<string, number>> {
    return this.http.get<Map<string, number>>(`${this.apiUrl}/grouped-total`, { headers: this.getHeaders() }).pipe(
      catchError(this.handleError)
    );
  }

  // Fetch cart items from API and update cache
  private fetchCartItems(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      tap(items => this.cartItems.next(items)),
      catchError(this.handleError)
    );
  }

  // Refresh cart items after modification
  private refreshCartItems(): void {
    this.fetchCartItems().subscribe();
  }

  // Handle HTTP errors
  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}