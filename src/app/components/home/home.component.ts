import { ChangeDetectorRef, Component,OnDestroy,OnInit  } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import {ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  animations: [
    trigger('carouselAnimation', [
      state('void', style({
        opacity: 0,
        transform: 'translateX(100%)'
      })),
      state('active', style({
        opacity: 1,
        transform: 'translateX(0)'
      })),
      transition('void => active', [
        animate('0.5s ease-in-out')
      ]),
      transition('active => void', [
        animate('0.5s ease-in-out')
      ])
    ])
  ]
})
export class HomeComponent  implements OnInit  {
  theme = {
    baseColor: '#FFA725',
    accentColor: 'emerald',
    textColor: 'gray'
  };



  carouselItems = [
    { title: 'Spring Sale', subtitle: 'Up to 50% off', image: 'sale-banner.jpg' },
    { title: 'New Arrivals', subtitle: 'Latest Tech Gadgets', image: 'new-arrivals.jpg' },
    { title: 'Free Shipping', subtitle: 'On orders over $50', image: 'shipping.jpg' }
  ];

  currentSlide = 0;
  private intervalId: NodeJS.Timeout | null = null;
  featuredProducts: Product[] = [];
  loading = false;  // Track loading state
  error: string | null = null;  // Track errors

  constructor(
    private cdr: ChangeDetectorRef,
    private productService: ProductService  // Inject the service
  ) {}

  ngOnInit() {
    this.loadProducts();  // Fetch products on init
  }

  

  addToCart(product: any) {
    console.log('Added to cart:', product);
  }

  buyNow(product: any) {
    console.log('Buy now:', product);
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.carouselItems.length;
  }

  prevSlide() {
    this.currentSlide = (this.currentSlide - 1 + this.carouselItems.length) % this.carouselItems.length;
  }
  private loadProducts() {
    this.loading = true;
    this.error = null;
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.featuredProducts = products;
        this.loading = false;
        this.cdr.detectChanges();  // Ensure UI updates
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}
