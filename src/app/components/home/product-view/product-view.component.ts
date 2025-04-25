import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
import { ReviewService } from '../../../services/review.service';
import { ReviewRequest } from '../../../models/review-request.model';
import { ReviewResponse } from '../../../models/review-response.model';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-view',
  standalone: false,
  templateUrl: './product-view.component.html',
  styleUrl: './product-view.component.css'
})
export class ProductViewComponent implements OnInit {
  theme = {
    baseColor: '#FFA725',
    accentColor: 'emerald',
    textColor: 'gray'
  };

  reviews: ReviewResponse[] = [];
newReview: ReviewRequest = { rating: 0, comment: '' };
editingReviewId: number | null = null;
userHasReview: boolean = false;

  product: Product | null = null;
  relatedProducts: Product[] = [];
  loading = false;
  error: string | null = null;
  quantity: number = 1;

  // Tab configuration
  productTabs = [
    { id: 'description', name: 'Description' },
    { id: 'specifications', name: 'Specifications' }
  ];
  activeTab: string = 'description';

  // Mock specifications (since not in Product model)
  productSpecifications = [
    { name: 'Material', value: 'High-grade synthetic' },
    { name: 'Weight', value: '500g' },
    { name: 'Dimensions', value: '10 x 5 x 3 cm' }
  ];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService,
    private reviewService: ReviewService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
      this.loadRelatedProducts();
      this.loadReviews(Number(productId));
    }
    this.cdr.detectChanges()
  }

  loadProduct(id: string) {
    this.loading = true;
    this.error = null;
    this.productService.getProductById(id).subscribe({
      next: (product: Product) => {
        this.product = product;
        console.log(this.product);
        
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      }
    });
  }

  loadRelatedProducts() {
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {

        this.relatedProducts = products.filter(p => p.category === this.product?.category && p.id !== this.product?.id ).slice(0, 4);
      },
      error: (err) => {
        console.error('Error loading related products:', err);
      }
    });
  }

  addToCart() {
    if (this.product && this.product.available) {
      this.cartService.addToCart(this.product.id, Number(this.quantity)).subscribe({
         next: () => {
                this.loading = false;
                Swal.fire({
                  toast: true,
                  position: 'top-end',
                  icon: 'success',
                  title: 'Product is adeed to the cart',
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
                  title: 'Failed added to cart.',
                  showConfirmButton: false,
                  timer: 2000,
                  timerProgressBar: true
                });
              }
      })
    }
  }



  buyNow() {
    this.router.navigate([`/order/buy/${this.product?.id}`])
  }

  updateQuantity(change: number) {
    const newQuantity:number = Number(this.quantity) + change;
    if (newQuantity >= 1 && (!this.product || newQuantity <= this.product.quantity)) {
      this.quantity = newQuantity;
    }

    
  }
  viewRelatedProduct(id:number){
    this.router.navigate([`/product/${id}`])
  }

  loadReviews(productId: number) {
    this.reviewService.getReviewsByProduct(productId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        this.userHasReview = reviews.some(r => r.canEditOrDelete); 
      },
      error: (err) => {
        console.error('Failed to load reviews', err);
      }
    });
  }
  
  submitReview(productId: number) {
    this.reviewService.addReview(productId, this.newReview).subscribe({
      next: (review) => {
        this.reviews.push(review);
        this.newReview = { rating: 0, comment: '' };
        this.userHasReview = true;
        Swal.fire({
          title: 'Thank you!',
          text: 'Your review was added successfully',
          icon: 'success',
          confirmButtonColor: '#4CAF50',
          confirmButtonText: 'Awesome!'
        });
        this.cdr.detectChanges()
        
      },
      error: (err) => {
        Swal.fire('Error', err.error.message || 'Could not add review! Please verify your purchase with this product.', 'error');
      }
    });

   
  }
  
  startEditReview(review: ReviewResponse) {
    this.editingReviewId = review.id;
    this.newReview = {
      rating: review.rating,
      comment: review.comment
    };
    this.cdr.detectChanges()
  }
  
  submitEditReview(reviewId: number) {
    this.reviewService.editReview(reviewId, this.newReview).subscribe({
      next: (updatedReview) => {
        const index = this.reviews.findIndex(r => r.id === reviewId);
        if (index !== -1) {
          this.reviews[index] = updatedReview;
        }
        this.editingReviewId = null;
        this.newReview = { rating: 0, comment: '' };
        Swal.fire({
          title: 'Updated!',
          text: 'Your review has been updated',
          icon: 'success',
          confirmButtonColor: '#1976D2',
          confirmButtonText: 'Great!'
        });
        this.cdr.detectChanges()
        
      },
      error: (err) => {
        Swal.fire('Error', err.error.message || 'Could not update review', 'error');
      }
    });
  }
  
  deleteReview(reviewId: number) {
    this.reviewService.deleteReview(reviewId).subscribe({
      next: () => {
        this.reviews = this.reviews.filter(r => r.id !== reviewId);
        this.userHasReview = false;
        Swal.fire({
          title: 'Deleted!',
          text: 'Your review has been removed 🗑️',
          icon: 'success',
          confirmButtonColor: '#E53935',
          confirmButtonText: 'OK'
        });
        this.cdr.detectChanges()
      },
      error: (err) => {
        Swal.fire('Error', err.error.message || 'Could not delete review', 'error');
      }
    });

  }
  

  gotoRelatedProductDetails(relatedProduct:Product){
    this.router.navigate([`product/${relatedProduct.id}`])
    this.cdr.detectChanges()

  }
}