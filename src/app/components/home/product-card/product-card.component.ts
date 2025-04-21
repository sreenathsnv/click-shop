import { Component,Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product:any;  
  @Input() theme: any;    
  
  @Output() buyNowClicked = new EventEmitter<any>();
  @Output() addToCartClicked = new EventEmitter<any>();

  constructor(private router: Router) {}
  
  navigateToProduct(id: string | number) {
    this.router.navigate(['/product', id]);
  }
  buyNow() {
    this.buyNowClicked.emit(this.product);
  }

  addToCart() {
    this.addToCartClicked.emit(this.product);
  }
}
