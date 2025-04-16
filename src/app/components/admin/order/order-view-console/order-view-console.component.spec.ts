import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderViewConsoleComponent } from './order-view-console.component';

describe('OrderViewConsoleComponent', () => {
  let component: OrderViewConsoleComponent;
  let fixture: ComponentFixture<OrderViewConsoleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OrderViewConsoleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrderViewConsoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
