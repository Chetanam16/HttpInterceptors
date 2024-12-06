import { Component } from '@angular/core';
import { ProductService } from '../../Services/product.service';
import { Product } from '../../Interfaces/product';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule,MatCardModule,MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  products: Product[] = [];

  constructor(private router:Router,private productService: ProductService) {}
onBuy(product:Product){
  const token = localStorage.getItem('authToken');
  if (!token) {
    console.error('Auth token is missing');
    return; // Exit early if no token
  }
  // const token =localStorage.getItem('authToken');
  
    this.productService.setProduct(product);
    console.log("Product selected:", product);
    console.log("hiii thanks for buying" );
    this.router.navigate(['/details']);

   
}
  ngOnInit(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        console.log('Products fetched:', data);
        this.products = data;
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
}
