import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../../../services/product.service';
import { Product } from '../../../../models/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-view-console',
  standalone: false,
  templateUrl: './product-view-console.component.html',
  styleUrl: './product-view-console.component.css'
})
export class ProductViewConsoleComponent implements OnInit {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  searchText: string = '';
  showLowStockOnly = false;
  sortOrder: 'asc' | 'desc' = 'asc';
  showDeleteConfirmation: boolean = false;
  productIdToDelete: string | null = null;

  constructor(
    private productService: ProductService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.applyFilters();
    });
  }

  applyFilters() {
    let result = this.products;

    if (this.searchText) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(this.searchText.toLowerCase()) ||
        p.description.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }

    if (this.showLowStockOnly) {
      result = result.filter(p => p.quantity < 10);
    }

    result = result.sort((a, b) => {
      return this.sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    });

    this.filteredProducts = result;
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
          this.products = this.products.filter(p => p.id !== Number(this.productIdToDelete));
          this.applyFilters();
          this.snackBar.open('Product deleted successfully', 'Close', {
            duration: 3000,
            panelClass: 'success-snackbar'
          });
          this.showDeleteConfirmation = false;
          this.productIdToDelete = null;
        },
        error: (error) => {
          console.error('Error deleting product:', error);
          this.snackBar.open('Failed to delete product. Please try again.', 'Close', {
            duration: 5000,
            panelClass: 'error-snackbar'
          });
          this.showDeleteConfirmation = false;
        }
      });
    }
  }
}
