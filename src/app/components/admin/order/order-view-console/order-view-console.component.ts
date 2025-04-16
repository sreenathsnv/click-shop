import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Order } from '../../../../models/order.model';
import { OrderService } from '../../../../services/order.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-order-view-console',
  standalone: false,
  templateUrl: './order-view-console.component.html',
  styleUrl: './order-view-console.component.css'
})
export class OrderViewConsoleComponent implements OnInit {

  orders: Order[] = [];
  expandedOrderId: number | null = null;
  searchQuery: string = '';
  filteredOrders: Order[] = [];
  selectedStatus: string = 'ALL';
  constructor(private http: HttpClient, private orderService:OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getOrdersAdmin().subscribe({
      next: (data: Order[]) => {
        this.orders = data;
        this.filteredOrders = data;
        console.log(data);
        
      },
      error: (error) => {
        console.error('Failed to fetch orders:', error);
      }
    });
  }
  filterOrders() {
    const query = this.searchQuery.toLowerCase().trim();
    this.filteredOrders = this.orders.filter(order =>{
     const  matchesSearch  = order.username.toLowerCase().includes(query) ||
      order.status.toLowerCase().includes(query) ||
      order.id.toString().includes(query);
    
      const matchesStatus = this.selectedStatus === 'ALL' || order.status === this.selectedStatus.toUpperCase();

      return matchesSearch && matchesStatus
    }
    
    );
  }
  

  toggleExpand(orderId: number): void {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }

  printReceipt(order: any) {
    const printContent = `
      <div>
        <h3>Order Receipt</h3>
        <p><strong>ID:</strong> ${order.id}</p>
        <p><strong>Total:</strong> ₹${order.totalAmount.toFixed(2)}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <hr>
        <h4>Items:</h4>
        <ul>
          ${order.orderItems.map((item: any) =>
            `<li>Product ${item.productId}: ${item.quantity} x ₹${item.price}</li>`
          ).join('')}
        </ul>
      </div>
    `;
    const printWindow = window.open('', '', 'width=600,height=400');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  }

exportAllOrders() {
  if (!this.orders || this.orders.length === 0) {
    alert('No orders available to export.');
    return;
  }

  const headers = [
    'Order ID',
    'Username',
    'Total Amount',
    'Status',
    'Order Date',
    'Order Items'
  ];

  const rows = this.orders.map(order => {
    const items = order.orderItems?.map((item: any) =>
      `Product ${item.productId}: ${item.quantity} x ₹${item.price}`
    ).join('; ');

    return [
      order.id,
      order.username,
      order.totalAmount?.toFixed(2),
      order.status,
      new Date(order.createdAt).toLocaleString(),
      `"${items}"`
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const fileName = `all_orders_${new Date().toISOString().split('T')[0]}.csv`;
  saveAs(blob, fileName);
}


  exportOrders() {
    if (!this.orders || this.orders.length === 0) {
      alert('No orders to export.');
      return;
    }
  
    const headers = ['Order ID', 'Total Amount', 'Status', 'Order Items'];
  
    const rows = this.orders.map(order => {
      const itemDetails = order.orderItems.map((item: any) => 
        `Product ${item.productId}: ${item.quantity} x ₹${Number(item.price)}`
      ).join('; ');
      return [
        order.id,
        order.totalAmount.toFixed(2),
        order.status,
        `"${itemDetails}"` 
      ];
    });
  
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const fileName = `orders_${new Date().toISOString().split('T')[0]}.csv`;
    saveAs(blob, fileName);
  }
}
