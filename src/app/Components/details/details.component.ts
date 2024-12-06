import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Product } from '../../Interfaces/product';
import { Router } from '@angular/router';
import { ProductService } from '../../Services/product.service';

@Component({
  selector: 'app-details',
  imports: [CommonModule,ReactiveFormsModule,FormsModule,MatCardModule,MatInputModule,MatFormFieldModule,MatButtonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css'
})
export class DetailsComponent {
  shippingForm: FormGroup;
  selectedProduct: Product | null = null;

  constructor(private fb: FormBuilder, private productService: ProductService,
    private router: Router) {
    this.shippingForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', [Validators.required]]
    });
    
  }
ngOnInit():void{
  this.productService.selectedProduct.subscribe((product) => {
    this.selectedProduct = product;
    if (!this.selectedProduct) {
      console.error('No product selected');
    }
  });
}
  onSubmit(): void {
    const token = localStorage.getItem('authToken'); 
    if (this.shippingForm.valid && this.selectedProduct) {
      console.log('Shipping Details:', this.shippingForm.value);
      alert('Shipping details submitted successfully!');
      this.router.navigate(['/payment']);
    }
    else{
      alert('you have been redirected to home page');
      this.router.navigate(['/']);
    }
  }
}
