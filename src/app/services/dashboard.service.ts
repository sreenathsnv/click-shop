import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private orderStatsUrl = 'http://localhost:8188/api/orders/stats';
  private userStatsUrl = 'http://localhost:8183/api/auth/all-users';
  private productStatsUrl = 'http://localhost:8185/api/products/stats';

  constructor(private http: HttpClient) {}

  getStats(): Observable<any> {
    return forkJoin({
      orders: this.http.get<any>(this.orderStatsUrl),
      users: this.http.get<any>(this.userStatsUrl),
      products: this.http.get<any>(this.productStatsUrl)
    }).pipe(
      map(({ orders, users, products }) => ({
        totalOrders: orders.totalOrders,
        activeOrders: orders.activeOrders,
        cancelledOrders: orders.cancelledOrders,
        revenueByMonth:this.transformRevenueByMonth(orders.revenueByMonth),
        totalUsers: users.length,

        totalAmount: orders.totalAmount, 

        totalProducts: products.totalProducts,
        inStockProducts: products.availableProducts,
        lowStockProducts: products.outOfStockProducts,
      }))
    );
  }

  private transformRevenueByMonth(revenueByMonth: { [key: string]: number }): number[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const revenueArray = months.map((month) => revenueByMonth[month] || 0);
    return revenueArray;
  }

}
