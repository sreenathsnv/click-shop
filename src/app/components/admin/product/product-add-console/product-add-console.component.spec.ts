import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductAddConsoleComponent } from './product-add-console.component';

describe('ProductAddConsoleComponent', () => {
  let component: ProductAddConsoleComponent;
  let fixture: ComponentFixture<ProductAddConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductAddConsoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductAddConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
