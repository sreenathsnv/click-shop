import { Component,Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { Product } from '../../../models/product.model';
import { ReviewService } from '../../../services/review.service';


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
  
  reviewCountAndRating = {reviewCount:0,rating:new Array()}

  
  constructor(private router: Router,
    private productService: ProductService,
    private reviewService : ReviewService
  ) {}
    
  
  navigateToProduct(id: string | number) {
    this.router.navigate(['/product', id]);
  }
  buyNow() {
    this.buyNowClicked.emit(this.product);
  }

  addToCart() {
    this.addToCartClicked.emit(this.product);
  }

  isNew(product:Product): boolean{
    
    const allProducts:Product[] = this.productService.products
    
    const sorted = [...allProducts].sort((a, b) => b.id - a.id); 
    const topIds = sorted.slice(0, 5).map(p => p.id);
    console.log(topIds.includes(product.id))
    return topIds.includes(product.id);
  }
  getReviewCountAndRating(product:Product){
    
    this.reviewService.getReviewsByProduct(product.id).subscribe(data=>{
      this.reviewCountAndRating.reviewCount =data.length || 0,
      this.reviewCountAndRating.rating= Array.from({ length: Math.round((data.reduce((total, review) => total + review.rating, 0)/data.length)) }, (_, index) => index)

    });
  }
}
