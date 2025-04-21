import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../../../services/product.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-product-add-console',
  standalone: false,
  templateUrl: './product-add-console.component.html',
  styleUrl: './product-add-console.component.css'
})
export class ProductAddConsoleComponent implements OnInit {

  productForm: FormGroup;
  submitted = false;
  successMessage = '';
  categories:string[]= []


  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [null, [Validators.required, Validators.min(0)]],
      quantity: [null, [Validators.required, Validators.min(0)]],
      available: [false],
      category: [""],
      imageURL: ['']
    });
  }

  ngOnInit(): void {
    // Auto-toggle availability based on quantity
    this.productForm.get('quantity')?.valueChanges.subscribe((value: number) => {
      
      if (value === 0) {
        this.productForm.get('available')?.setValue(false, { emitEvent: false });
      } else if (value > 0) {
        this.productForm.get('available')?.setValue(true, { emitEvent: false });
      }
    });

    this.productService.getAllCategories().subscribe({
      next: (data) => {
        this.categories = data;
      },
      error: (err) => console.error('Failed to fetch categories:', err)
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.productForm.invalid) return;

    const formData = this.productForm.value;

    this.productService.addProduct(formData).subscribe({
      next: () => {
        this.toastr.success('Product added successfully!', 'Success');
        this.productForm.reset();
        this.submitted = false;
        
        setTimeout(() => this.router.navigate(['/admin/dashboard/products/view']), 1500);
      },
      error: (err: any) => {
        this.toastr.error('Failed to add product.', 'Error');
        console.error('Error:', err)}
    });
  }

  get f() {
    return this.productForm.controls;
  }
}
