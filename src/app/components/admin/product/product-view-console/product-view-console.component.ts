import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-view-console',
  standalone: false,
  templateUrl: './product-view-console.component.html',
  styleUrl: './product-view-console.component.css',
})
export class ProductViewConsoleComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchText: string = '';
  showLowStockOnly = false;
  sortOrder: 'asc' | 'desc' = 'asc';
  showDeleteConfirmation: boolean = false;
  productIdToDelete: string | null = null;

  categories: string[] = [];
  selectedCategory: string = '';

  currentPage: number = 1;
  productsPerPage: number = 6;
  totalPages: number = 1;

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.getCategories();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      
      this.applyFilters();
    });
  }


  getCategories(): void {
    this.productService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (error) => {
        console.error('Error fetching categories:', error);
      }
    });
  } 
  applyFilters() {
    let result = this.products;

    if (this.searchText) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
          p.description.toLowerCase().includes(this.searchText.toLowerCase())||
         ( !this.selectedCategory || p.category === this.selectedCategory)
      );
    }

    if (this.selectedCategory) {
      result = result.filter((p) => p.category === this.selectedCategory);
    }

    if (this.showLowStockOnly) {
      result = result.filter((p) => p.quantity < 10);
    }

    result = result.sort((a, b) => {
      return this.sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    });

    this.filteredProducts = result;
    this.updatePagination();
  }

  toggleLowStockFilter() {
    this.showLowStockOnly = !this.showLowStockOnly;
    this.applyFilters();
  }

  toggleSortOrder() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.applyFilters();
  }

  deleteProduct(productId: string): void {
    this.productIdToDelete = productId;
    this.showDeleteConfirmation = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirmation = false;
    this.productIdToDelete = null; // ✅ Now allowed
  }

  confirmDelete(): void {
    if (this.productIdToDelete) {
      this.productService.deleteProduct(this.productIdToDelete).subscribe({
        next: () => {
          this.products = this.products.filter(
            (p) => p.id !== Number(this.productIdToDelete)
          );
          this.applyFilters();
          this.snackBar.open('Product deleted successfully', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar',
          });
          this.showDeleteConfirmation = false;
          this.productIdToDelete = null;
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.snackBar.open(
            'Failed to delete product. Please try again.',
            'Close',
            {
              duration: 5000,
              panelClass: 'error-snackbar',
            }
          );
          this.showDeleteConfirmation = false;
        },
      });
    }
  }

  updatePagination(): void {
    this.totalPages =
      Math.ceil(this.filteredProducts.length / this.productsPerPage) || 1;
    this.currentPage = Math.min(this.currentPage, this.totalPages) || 1;
    console.log(
      'Total pages:',
      this.totalPages,
      'Current page:',
      this.currentPage
    ); // Debug log
  }

  get paginatedProducts(): Product[] {
    const startIndex = (this.currentPage - 1) * this.productsPerPage;
    const slicedProducts = this.filteredProducts.slice(
      startIndex,
      startIndex + this.productsPerPage
    );
    console.log('Paginated products:', slicedProducts); // Debug log
    return slicedProducts;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
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
    console.log('Visible pages:', visiblePages); // Debug log
    return visiblePages;
  }
}
