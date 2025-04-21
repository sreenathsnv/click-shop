import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../../../services/order.service';
import { ProductService } from '../../../services/product.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-direct-order',
  standalone: false,
  templateUrl: './direct-order.component.html',
  styleUrl: './direct-order.component.css'
})
export class DirectOrderComponent {

  product: any;
  quantity: number = 1;
  loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.productService.getProductById(productId).subscribe({
        next: (res) => (this.product = res),
        error: () => alert('Failed to load product')
      });
    }
  }

  placeOrder() {
    if (!this.product?.id) return;
  
    this.loading = true;
    this.orderService.createOrderFromProduct(this.product.id, this.quantity).subscribe({
      next: () => {
        this.loading = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Order placed successfully!',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
      },
      error: () => {
        this.loading = false;
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Failed to place order.',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
      }
    });
  }
  

  increaseQuantity() {
    this.quantity += 1;
  }
  
  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity -= 1;
    }
  }
  
}
