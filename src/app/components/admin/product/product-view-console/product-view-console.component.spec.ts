import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductViewConsoleComponent } from './product-view-console.component';

describe('ProductViewConsoleComponent', () => {
  let component: ProductViewConsoleComponent;
  let fixture: ComponentFixture<ProductViewConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductViewConsoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductViewConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
