import { Component, OnInit } from '@angular/core';
import { User } from '../../../auth/models/user.model';
import { Order } from '../../../models/order.model';
import { CartItem } from '../../../models/cart-item';
import { UserService } from '../../../services/user.service';
import { OrderService } from '../../../services/order.service';
import { CartService } from '../../../services/cart.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-profile',
  standalone: false,
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user!: User;
  orders: Order[] = [];
  cartItems: CartItem[] = [];

  editing = false;
  showPasswordReset = false;
  newPassword = '';

  constructor(
    private userService: UserService,
    private orderService: OrderService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
    this.loadOrders();
    this.loadCart();
  }

  loadUserProfile(): void {
    this.userService.userProfile().subscribe({
      next: (data) => (this.user = data),
      error: (err) => console.error('Failed to fetch user', err),
    });
  }

  loadOrders(): void {
    this.orderService.getUserOrders().subscribe({
      next: (data) => (this.orders = data),
      error: (err) => console.error('Failed to fetch orders', err),
    });
  }

  loadCart(): void {
    this.cartService.getCartItems().subscribe({
      next: (data) => (this.cartItems = data),
      error: (err) => console.error('Failed to fetch cart items', err),
    });
  }

  enableEdit() {
    this.editing = true;
  }

  cancelEdit() {
    this.editing = false;
    this.loadUserProfile(); // Re-fetch to discard unsaved changes
  }

  togglePasswordReset() {
    this.showPasswordReset = !this.showPasswordReset;
  }

  updateUser() {
    this.userService.updateUser(this.user).subscribe({
      next: (data) => {
        this.user = data;
        this.editing = false;
        Swal.fire('Success', 'User updated successfully', 'success');
      },
      error: (err) => {
        Swal.fire('Error', 'Failed to update user', 'error');
      },
    });
  }

  resetPassword() {
    if (!this.newPassword) return;
  
    this.userService.resetPassword(this.user.email, this.newPassword).subscribe({
      next: (res) => {
        Swal.fire('Success', res.message, 'success');
        this.showPasswordReset = false;
        this.newPassword = '';
      },
      error: (err) => {
        Swal.fire('Error', err.error?.message || 'Failed to reset password', 'error');
      },
    });
  }
  
}
