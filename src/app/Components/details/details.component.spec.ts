import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../Services/product.service';
import { of } from 'rxjs';
import { Product } from '../../Interfaces/product';
import { By } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let productService: ProductService;
  let router: Router;

  const mockProduct: Product = {
    id: 1,
    image: 'image1.jpg',
    price: 100,
    description: 'Test Product',
    name: '',
    token: ''
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        DetailsComponent,
        ReactiveFormsModule,
        FormsModule,
        MatCardModule,
        MatInputModule,
        MatFormFieldModule,
        MatButtonModule,
        BrowserAnimationsModule, // Add BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        {
          provide: ProductService,
          useValue: {
            selectedProduct: of(mockProduct), // Mocking product service to return the mock product
            setProduct: jasmine.createSpy('setProduct'),
          },
        },
        {
          provide: Router,
          useValue: { navigate: jasmine.createSpy('navigate') }, // Mocking the Router
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the selected product from the product service', () => {
    expect(component.selectedProduct).toEqual(mockProduct);
  });

  it('should show error when no product is selected', () => {
    productService.selectedProduct = of(null); // Simulate no product
    fixture.detectChanges();

    component.ngOnInit();
    expect(component.selectedProduct).toBeNull();
    const errorMessage = console.error as jasmine.Spy;
    expect(errorMessage).toHaveBeenCalledWith('No product selected');
  });

  it('should disable the submit button when the form is invalid', () => {
    component.shippingForm.controls['name'].setValue('');
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBeTrue();
  });

  it('should enable the submit button when the form is valid', () => {
    component.shippingForm.controls['name'].setValue('John Doe');
    component.shippingForm.controls['email'].setValue('test@example.com');
    component.shippingForm.controls['phone'].setValue('1234567890');
    component.shippingForm.controls['address'].setValue('123 Main St');
    fixture.detectChanges();

    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBeFalse();
  });

  it('should navigate to payment page if form is valid and product is selected', () => {
    component.shippingForm.controls['name'].setValue('John Doe');
    component.shippingForm.controls['email'].setValue('test@example.com');
    component.shippingForm.controls['phone'].setValue('1234567890');
    component.shippingForm.controls['address'].setValue('123 Main St');

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/payment']);
  });

  it('should navigate to home page if form is invalid or no product is selected', () => {
    component.shippingForm.controls['name'].setValue('');
    component.shippingForm.controls['email'].setValue('');
    component.shippingForm.controls['phone'].setValue('');
    component.shippingForm.controls['address'].setValue('');

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should show an alert on successful submission', () => {
    spyOn(window, 'alert'); // Mock alert

    component.shippingForm.controls['name'].setValue('John Doe');
    component.shippingForm.controls['email'].setValue('test@example.com');
    component.shippingForm.controls['phone'].setValue('1234567890');
    component.shippingForm.controls['address'].setValue('123 Main St');

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('Shipping details submitted successfully!');
  });

  it('should show an alert and navigate to home page if no product is selected', () => {
    productService.selectedProduct = of(null); // Simulate no product
    fixture.detectChanges();

    component.shippingForm.controls['name'].setValue('John Doe');
    component.shippingForm.controls['email'].setValue('test@example.com');
    component.shippingForm.controls['phone'].setValue('1234567890');
    component.shippingForm.controls['address'].setValue('123 Main St');

    spyOn(window, 'alert'); // Mock alert

    component.onSubmit();

    expect(window.alert).toHaveBeenCalledWith('you have been redirected to home page');
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
