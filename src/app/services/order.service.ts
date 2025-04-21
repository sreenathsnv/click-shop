import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Order } from '../models/order.model';
import { CartService } from './cart.service';
import { CartItem } from '../models/cart-item';

export interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  categoryStats: { [key: string]: number };
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8188/api/orders';
  private token: string | null;

  constructor(private http: HttpClient, private cartService: CartService) {
    this.token = localStorage.getItem('authToken');
  }

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: this.token ? `Bearer ${this.token}` : '',
      'Content-Type': 'application/json',
    });
  }

  createOrderFromCart(): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(`${this.apiUrl}/cart`, {}, { headers });
  }

  fetchCartItems(): Observable<CartItem[]> {
    return this.cartService.getCartItems();
  }

  getOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  getOrdersAdmin(): Observable<Order[]> {
    return this.http
      .get<Order[]>(`${this.apiUrl}/admin/orders`)
      .pipe(catchError(this.handleError));
  }

  getOrderById(id: number): Observable<Order> {
    return this.http
      .get<Order>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  getOrderStats(): Observable<OrderStats> {
    return this.http
      .get<OrderStats>(`${this.apiUrl}/stats`)
      .pipe(catchError(this.handleError));
  }

  createOrderFromProduct(productId: number, quantity: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post<any>(
      `${this.apiUrl}/product?productId=${productId}&quantity=${quantity}`,
      {},
      { headers }
    );
  }

  // Get all user orders
  getUserOrders(): Observable<Order[]> {
    const headers = this.getHeaders();
    return this.http.get<Order[]>(`${this.apiUrl}`, {
      headers,
    });
  }

  // Cancel order
  cancelOrder(id: number): Observable<Order> {
    const headers = this.getHeaders();
    return this.http.put<Order>(
      `${this.apiUrl}/${id}/cancel`,
      {},
      {headers}
    );
  }

  private handleError(error: HttpErrorResponse) {
    let message = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      message = `Error: ${error.error.message}`;
    } else {
      message = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(message));
  }
}
