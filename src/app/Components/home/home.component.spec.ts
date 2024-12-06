import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { ProductService } from '../../Services/product.service';
import { Product } from '../../Interfaces/product';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let router: jasmine.SpyObj<Router>;

  const mockProducts: Product[] = [
    {
      id: 1, image: 'image1.jpg', price: 100, description: 'Product 1',
      name: '',
      token: ''
    },
    {
      id: 2, image: 'image2.jpg', price: 200, description: 'Product 2',
      name: '',
      token: ''
    },
  ];

  beforeEach(async () => {
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProducts', 'setProduct']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent,MatCardModule, MatButtonModule, RouterTestingModule],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on initialization', () => {
    productService.getProducts.and.returnValue(of(mockProducts));

    component.ngOnInit();

    expect(productService.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(mockProducts);
  });

  it('should handle error when fetching products', () => {
    const errorMessage = 'Error fetching products';
    spyOn(console, 'error');
    productService.getProducts.and.returnValue(throwError(() => new Error(errorMessage)));

    component.ngOnInit();

    expect(productService.getProducts).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalledWith('Error fetching products:', jasmine.any(Error));
    expect(component.products).toEqual([]);
  });

  it('should call setProduct and navigate when onBuy is called', () => {
    const selectedProduct: Product = {
      id: 1, image: 'image1.jpg', price: 100, description: 'Product 1',
      name: '',
      token: ''
    };
    localStorage.setItem('authToken', 'valid-token');

    component.onBuy(selectedProduct);

    expect(productService.setProduct).toHaveBeenCalledWith(selectedProduct);
    expect(router.navigate).toHaveBeenCalledWith(['/details']);
    expect(console.log).toHaveBeenCalledWith('Product selected:', selectedProduct);
    expect(console.log).toHaveBeenCalledWith('hiii thanks for buying');
  });

  it('should not navigate if the auth token is missing', () => {
    const selectedProduct: Product = {
      id: 1, image: 'image1.jpg', price: 100, description: 'Product 1',
      name: '',
      token: ''
    };
    localStorage.removeItem('authToken');

    component.onBuy(selectedProduct);

    expect(productService.setProduct).toHaveBeenCalledWith(selectedProduct);
    expect(router.navigate).toHaveBeenCalledWith(['/details']);
  });
  it('should handle missing auth token gracefully in onBuy', () => {
    const selectedProduct: Product = {
      id: 1, image: 'image1.jpg', price: 100, description: 'Product 1',
      name: '',
      token: ''
    };
    spyOn(console, 'log');
    localStorage.removeItem('authToken'); // Simulate missing token
  
    component.onBuy(selectedProduct);
  
    expect(productService.setProduct).toHaveBeenCalledWith(selectedProduct);
    expect(console.log).toHaveBeenCalledWith('Product selected:', selectedProduct);
    expect(router.navigate).toHaveBeenCalledWith(['/details']);
  });
  
  it('should handle onBuy when product is null or undefined', () => {
    spyOn(console, 'log');
  
    component.onBuy(null as unknown as Product); // Simulate null product
    expect(console.log).not.toHaveBeenCalled();
  });
  
  it('should log error if getProducts fails with different errors', () => {
    spyOn(console, 'error');
  
    productService.getProducts.and.returnValue(throwError(() => new Error('Network Error')));
    component.ngOnInit();
  
    expect(console.error).toHaveBeenCalledWith('Error fetching products:', jasmine.any(Error));
  });
  
  it('should initialize with empty product list when getProducts returns undefined', () => {
    productService.getProducts.and.returnValue(of(undefined as unknown as Product[]));
  
    component.ngOnInit();
  
    expect(component.products).toEqual([]);
  });
  
});
