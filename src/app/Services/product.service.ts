import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, throwError } from 'rxjs';
import { Product } from '../Interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
private apiUrl='http://localhost:3000/products'
  constructor(private http: HttpClient) {
  //   if (!localStorage.getItem('authToken')) {
  //   localStorage.setItem('authToken', 'myTokens'); 
  // }
 }
 
  getProducts(): Observable<Product[]> {
    const token = localStorage.getItem('authToken');  // Retrieve token from localStorage

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,  // Use the token stored in localStorage
    });
  
    return this.http.get<Product[]>(this.apiUrl, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching products:', error);
        return throwError(() => new Error('Failed to fetch products'));
      })
    );
  }
  private productSource = new BehaviorSubject<Product | null>(null);
  selectedProduct = this.productSource.asObservable();

  setProduct(product: Product): void {
    this.productSource.next(product);
  }

  
}
