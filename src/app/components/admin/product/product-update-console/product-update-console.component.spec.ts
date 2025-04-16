import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductUpdateConsoleComponent } from './product-update-console.component';

describe('ProductUpdateConsoleComponent', () => {
  let component: ProductUpdateConsoleComponent;
  let fixture: ComponentFixture<ProductUpdateConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductUpdateConsoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductUpdateConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
