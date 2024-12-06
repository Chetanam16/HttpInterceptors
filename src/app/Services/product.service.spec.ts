import { TestBed } from '@angular/core/testing';
import { ProductService } from './product.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Product } from '../Interfaces/product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  const mockProducts: Product[] = [
    {
      id: 1, image: 'image1.jpg', price: 100, description: 'Product 1',
      name: '',
      token: ''
    },
    {
      id: 2, image: 'image2.jpg', price
      : 200, description: 'Product 2',
      name: '',
      token: ''
    },
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products successfully', () => {
    service.getProducts().subscribe((products) => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne('http://localhost:3000/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts); // Simulate a successful response
  });

  it('should handle errors when fetching products', () => {
    const errorMessage = 'Failed to fetch products';

    service.getProducts().subscribe(
      () => fail('Expected error, but got a successful response'),
      (error) => {
        expect(error.message).toBe(errorMessage);
      }
    );

    const req = httpMock.expectOne('http://localhost:3000/products');
    expect(req.request.method).toBe('GET');
    req.error(new ErrorEvent('Network error'));
  });

  it('should set and get the selected product', () => {
    const selectedProduct: Product = {
      id: 1,
      image: 'image1.jpg',
      price: 100,
      description: 'Product 1',
      name: '',
      token: ''
    };

    service.setProduct(selectedProduct);

    service.selectedProduct.subscribe((product) => {
      expect(product).toEqual(selectedProduct);
    });
  });

  it('should return null for selectedProduct initially', () => {
    service.selectedProduct.subscribe((product) => {
      expect(product).toBeNull();
    });
  });
});
