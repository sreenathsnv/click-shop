import { Component, OnInit } from '@angular/core';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../../services/cart.service';
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
    private cartService: CartService
  ) {}


  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.loadProduct(productId);
      this.loadRelatedProducts();
    }
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
}