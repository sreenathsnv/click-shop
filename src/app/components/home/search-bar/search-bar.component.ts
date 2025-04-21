import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';
import { Product } from '../../../models/product.model';
import { ProductService } from '../../../services/product.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  standalone:false,
  animations: [
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
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() brandColor: string = '#FFA725'; // Default to match theme
  @Input() isMobile: boolean = false; // To adjust styling for mobile

  searchQuery: string = '';
  searchResults: Product[] = [];
  showSearchResults: boolean = false;
  private searchSubject = new Subject<string>();
  private products: Product[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit() {
    // Load products for search
    this.productService.getProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });

    // Setup debounced search
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchProducts(query);
    });
  }

  ngOnDestroy() {
    this.searchSubject.complete();
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

    this.searchResults = this.products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description?.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5); // Limit to 5 suggestions
  }

  selectProduct(product: Product) {
    this.searchQuery = '';
    this.searchResults = [];
    this.showSearchResults = false;
    this.router.navigate(['/product', product.id]);
  }
}