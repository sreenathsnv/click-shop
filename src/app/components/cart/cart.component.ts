import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
  standalone:false
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalAmount: number = 0;
  isLoading: boolean = false;
  error: string | null = null;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCartItems().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.isLoading = false;
        this.calculateTotal();
      },
      error: (err) => {
        this.error = err.message;
        this.isLoading = false;
      }
    });
  }

  calculateTotal(): void {
    this.cartService.getTotalAmount().subscribe({
      next: (total) => {
        this.totalAmount = total;
      },
      error: (err) => {
        this.error = err.message;
      }
    });
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity < 1) return; // Prevent negative or zero quantities
    this.cartService.updateQuantity(item.productId, quantity).subscribe({
      next: (updatedItem) => {
        item.quantity = updatedItem.quantity;
        item.totalPrice = updatedItem.totalPrice;
        this.calculateTotal();
      },
      error: (err) => {
        this.error = err.message;
      }
    });
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.productId !== productId);
        this.calculateTotal();
      },
      error: (err) => {
        this.error = err.message;
      }
    });
  }

  buyAll(): void {
   this.router.navigate(['/order/cart'])
  }
}