// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Product } from '../models/product.model';


@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiUrl = 'http://localhost:8185/api/products'; 
  
  constructor(private http: HttpClient) {}


  addProduct(product: Product): Observable<any> {
    return this.http.post(`${this.apiUrl}`, product);
  }
  
    // Fetch product by ID
    getProductById(id: string): Observable<any> {
      return this.http.get<any>(`${this.apiUrl}/${id}`);
    }
  
    // Update product
    updateProduct(product: any): Observable<any> {
      return this.http.put<any>(`${this.apiUrl}/${product.id}`, product);
    }
    deleteProduct(id: string): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/${id}`).pipe(
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
}