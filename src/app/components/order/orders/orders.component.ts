import { Component, OnInit } from '@angular/core';
import { Order, OrderItemWithDetails } from '../../../models/order.model';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  standalone: false,
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  expandedOrderId: number | null = null;
  orderItemDetailsMap: { [key: number]: OrderItemWithDetails[] } = {}; // orderId -> items
  activeTab: 'active' | 'cancelled' = 'active';

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  get filteredOrders(): Order[] {
    return this.orders.filter(order =>
      this.activeTab === 'active' ? order.status !== 'CANCELLED' : order.status === 'CANCELLED'
    );
  }

  loadOrders() {
    this.orderService.getUserOrders().subscribe(orders => {
      this.orders = orders;
    });
  }

  toggleOrderDetails(order: Order) {
    const isAlreadyExpanded = this.expandedOrderId === order.id;
    this.expandedOrderId = isAlreadyExpanded ? null : order.id;

    if (!this.orderItemDetailsMap[order.id]) {
      this.loadOrderItemDetails(order);
    }
  }

  loadOrderItemDetails(order: Order) {
    const itemDetails$: Promise<OrderItemWithDetails>[] = order.orderItems.map(item =>
      this.productService.getProductById(item.productId.toString())
        .toPromise()
        .then(product => ({
          ...item,
          name: product.name
        }))
    );

    Promise.all(itemDetails$).then(details => {
      this.orderItemDetailsMap[order.id] = details;
    });
  }

  onCancelOrder(id: number) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to cancel this order?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e3342f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.orderService.cancelOrder(id).subscribe(() => {
          this.loadOrders();
          Swal.fire({
            icon: 'success',
            title: 'Cancelled!',
            text: 'Your order has been cancelled.',
            timer: 2000,
            showConfirmButton: false
          });
        });
      }
    });
  }
  

}
