import { Component,Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {
  @Input() product: any;  
  @Input() theme: any;    
  
  @Output() buyNowClicked = new EventEmitter<any>();
  @Output() addToCartClicked = new EventEmitter<any>();

  buyNow() {
    this.buyNowClicked.emit(this.product);
  }

  addToCart() {
    this.addToCartClicked.emit(this.product);
  }
}
