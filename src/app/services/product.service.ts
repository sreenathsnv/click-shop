// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Product } from '../models/product.model';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8185/api/products'; 
  token:string | null;
  constructor(private http: HttpClient) {

    this.token = this.getTokenFromCookies();
 
    
  }
 
  private getTokenFromCookies(): string | null {
    const match = document.cookie.match(new RegExp('(^| )auth_token=([^;]+)'));
    

    return match ? match[2] : null;
  }
  private getHeaders(): HttpHeaders {
    this.token = this.getTokenFromCookies()
    console.log("token",this.token)
    return new HttpHeaders({
      Authorization: this.token ? `Bearer ${this.token}` : '',
      'Content-Type': 'application/json',
    });
  }

  addProduct(product: Product): Observable<any> {
    const headers = this.getHeaders();
    return this.http.post(`${this.apiUrl}`, product,{headers});
  }
  
    // Fetch product by ID
    getProductById(id: string): Observable<any> {
      
      return this.http.get<any>(`${this.apiUrl}/${id}`);
    }
  
    // Update product
    updateProduct(product: any): Observable<any> {
      const headers = this.getHeaders();
      return this.http.put<any>(`${this.apiUrl}/${product.id}`, product,{headers});
    }
    deleteProduct(id: string): Observable<any> {
      const headers = this.getHeaders();
      return this.http.delete<any>(`${this.apiUrl}/${id}`,{headers}).pipe(
        tap(() => console.log(`Product with ID ${id} deleted`)),
        catchError(this.handleError)
      );
    }
  // Fetch products from the API
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      map((data: Product[]) => data), 
      catchError(this.handleError)     
    );
  }

  // Error handling
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
  // All available categories
  getAllCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/categories`).pipe(
      catchError(this.handleError)
    );
  }
}