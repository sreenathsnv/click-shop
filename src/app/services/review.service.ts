import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Injectable } from '@angular/core';
import { ReviewResponse } from '../models/review-response.model';
import { Observable } from 'rxjs';
import { ReviewRequest } from '../models/review-request.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private apiUrl = 'http://localhost:8185/api/review'; 

  constructor(private http: HttpClient) {}

  private getTokenFromCookies(): string | null {
    const match = document.cookie.match(new RegExp('(^| )auth_token=([^;]+)'));
    

    return match ? match[2] : null;
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getTokenFromCookies()
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  addReview(productId: number, request: ReviewRequest): Observable<ReviewResponse> {
    const headers = this.getAuthHeaders();
    return this.http.post<ReviewResponse>(
      `${this.apiUrl}/${productId}`,
      request,
      { headers}
    );
  }

  editReview(reviewId: number, request: ReviewRequest): Observable<ReviewResponse> {
    const headers = this.getAuthHeaders();
    return this.http.put<ReviewResponse>(
      `${this.apiUrl}/${reviewId}`,
      request,
      { headers}
    );
  }

  deleteReview(reviewId: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(
      `${this.apiUrl}/${reviewId}`,
      { headers}
    );
  }

  getReviewsByProduct(productId: number): Observable<ReviewResponse[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<ReviewResponse[]>(
      `${this.apiUrl}/product/${productId}`,
      { headers}
    );
  }

  getReviewsByUser(username: string): Observable<ReviewResponse[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<ReviewResponse[]>(
      `${this.apiUrl}/user`,
      { headers}
    );
  }

}