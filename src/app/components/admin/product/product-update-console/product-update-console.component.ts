import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-update-console',
  standalone: false,
  templateUrl: './product-update-console.component.html',
  styleUrl: './product-update-console.component.css'
})
export class ProductUpdateConsoleComponent {

  productForm: FormGroup;
  submitted = false;
  productId: string ="";
  successMessage = '';
  loading = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [null, [Validators.required, Validators.min(0)]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      available: [false] // Initially setting available to false
    });
  }

  ngOnInit(): void {
    // Get the productId from the URL route parameters
    this.productId = this.route.snapshot.paramMap.get('id')!;
    
    
    this.loadProductDetails();
  }

  loadProductDetails() {
    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        // Populate the form with fetched data
        this.productForm.patchValue({
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity,
          available: product.quantity > 0 
        });
      },
      error: (err) => {
        console.error('Error loading product details:', err);
        this.toastr.error('Failed to load product details');
      }
    });
  }

  // Handle form submission to update the product
  onSubmit() {
    this.submitted = true;

    if (this.productForm.invalid) return;

    // Update the available field based on quantity
    const formValue = { ...this.productForm.value };
    if (formValue.quantity > 0) {
      formValue.available = true;
    } else {
      formValue.available = false;
    }

    // Set the productId to be sent in the request
    formValue.id = this.productId;

    this.loading = true;

    // Call updateProduct on the ProductService
    this.productService.updateProduct(formValue).subscribe({
      next: () => {
        this.toastr.success('Product updated successfully!');
        // this.router.navigate(['/admin/dashboard/product/view']);
      },
      error: (err:any) => {
        console.error('Error updating product:', err);
        this.toastr.error('Something went wrong while updating the product');
      },
      complete: () => this.loading = false
    });
  }

  get f() {
    return this.productForm.controls;
  }
}
