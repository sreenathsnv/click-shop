import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../../models/cart-item';
import { User } from '../../../auth/models/user.model';
import { CartService } from '../../../services/cart.service';
import { UserService } from '../../../services/user.service';
import { OrderService } from '../../../services/order.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-order-cart',
  standalone: false,
  templateUrl: './order-cart.component.html',
  styleUrl: './order-cart.component.css'
})
export class OrderCartComponent implements OnInit{

  cartItems: CartItem[] = [];
  user: User | null = null;
  totalAmount: number = 0;

  constructor(
    private cartService: CartService,
    private userService: UserService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadCartItems();
    this.loadUserProfile();
  }

  loadCartItems() {
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.calculateTotal();
      },
      error: () => alert('Failed to load cart items')
    });
  }

  loadUserProfile() {
    this.userService.userProfile().subscribe({
      next: (user) => {
        this.user = user;
        console.log("user is :" ,user)
      },
      error: () => alert('Failed to load user profile')
    });
  }

  calculateTotal(): void {
    this.cartService.getTotalAmount().subscribe({
      next: (total) => {
        this.totalAmount = total;
      },
      error: (err) => {
       
      }
    });
  }

  placeOrder() {
    this.orderService.createOrderFromCart().subscribe({
      next: () => {
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
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'error',
          title: 'Failed to place order',
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true
        });
      }
    });
  }
  
  
}
