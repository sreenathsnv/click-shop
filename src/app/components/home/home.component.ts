import { ChangeDetectorRef, Component, EventEmitter, OnDestroy, OnInit, Output, output } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, Subscription } from 'rxjs';
import { CartService } from '../../services/cart.service';


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
    ]),
    trigger('searchAnimation', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(-10px)',
        display: 'none'
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translateY(0)',
        display: 'block'
      })),
      transition('hidden <=> visible', [
        animate('0.3s ease-in-out')
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, OnDestroy {


  theme = {
    baseColor: '#FFA725',
    accentColor: 'emerald',
    textColor: 'gray'
  };

  currentPage: number = 1;
  productsPerPage: number = 12;
  totalPages: number = 1;

  filteredProducts: Product[] = [];
  sortOption: string = 'lowToHigh';
  priceRange: number[] = [4000, 100000];
  minPrice: number = 4000;
  maxPrice: number = 200000;

  searchQuery: string = '';
  searchResults: Product[] = [];
  showSearchResults: boolean = false;
  private searchSubject = new Subject<string>();

  carouselItems = [
    { title: 'Spring Sale', subtitle: 'Up to 50% off', image: 'sale-banner.jpg' },
    { title: 'New Arrivals', subtitle: 'Latest Tech Gadgets', image: 'new-arrivals.jpg' },
    { title: 'Free Shipping', subtitle: 'On orders over $50', image: 'shipping.jpg' }
  ];

  currentSlide = 0;
  private intervalId: NodeJS.Timeout | null = null;
  featuredProducts: Product[] = [];
  loading = false;
  error: string | null = null;
  cartSubscription: Subscription = new Subscription;

  


  constructor(
    private cdr: ChangeDetectorRef,
    private productService: ProductService,
    private router: Router,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.cartSubscription = this.cartService.getCartItems().subscribe(cartItems => {
      
    });
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchProducts(query);
    });
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  onSearchInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value;
    this.showSearchResults = inputElement.value.length > 0;
    this.searchSubject.next(inputElement.value);
  }

  searchProducts(query: string) {
    if (!query.trim()) {
      this.searchResults = [];
      this.showSearchResults = false;
      return;
    }

    this.searchResults = this.featuredProducts.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5);
    this.cdr.detectChanges();
  }

  selectProduct(product: Product) {
    this.searchQuery = '';
    this.searchResults = [];
    this.showSearchResults = false;
    this.router.navigate(['/product', product.id]);
  }



  getVisiblePages(): number[] {
    const maxVisiblePages = 5;
    const halfWindow = Math.floor(maxVisiblePages / 2);
    let startPage = Math.max(1, this.currentPage - halfWindow);
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);

   
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const visiblePages: number[] = [];
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }
    return visiblePages;
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product.id, 1).subscribe({
      next: () => console.log("Item added to cart"),
      error: err => console.error("Error adding to cart", err)
    });
    
  }

  buyNow(product: Product) {
    this.router.navigate([`/order/buy/${product.id}`])
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
        this.filteredProducts = products; 
        this.setPriceRangeBoundaries();
        this.sortProducts(); 
        this.filterProducts(); 
        this.updatePagination();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = err.message;
        console.error('Error loading products:', err); // Debug log
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredProducts.length / this.productsPerPage);
    this.currentPage = Math.min(this.currentPage, this.totalPages) || 1;
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.productsPerPage);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.cdr.detectChanges();
    }
  }

  filterProducts(): void {
    this.filteredProducts = this.featuredProducts.filter(product =>
      product.price >= this.priceRange[0] && product.price <= this.priceRange[1]
    );
    this.sortProducts();
    this.updatePagination();
    this.goToPage(1); // Reset to first page when filtering
  }

  sortProducts(): void {
    this.filteredProducts = [...this.filteredProducts].sort((a, b) => {
      if (this.sortOption === 'lowToHigh') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });
    this.updatePagination();
  }

  setPriceRangeBoundaries(): void {
    if (this.featuredProducts.length > 0) {
      const prices = this.featuredProducts.map(p => p.price);
      this.minPrice = Math.floor(Math.min(...prices));
      this.maxPrice = Math.ceil(Math.max(...prices));
      this.priceRange = [this.minPrice, this.maxPrice];
    }
  }



}