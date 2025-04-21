  import { ChangeDetectorRef, Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartService } from '../../../services/cart.service';

  @Component({
    selector: 'app-navlayout',
    standalone: false,
    templateUrl: './navlayout.component.html',
    styleUrl: './navlayout.component.css'
  })
  export class NavlayoutComponent {

    totalCartCount:number=0;
  private cartSubscription: Subscription = new Subscription;

  constructor(private cdr: ChangeDetectorRef,private cartService: CartService) {}


  ngOnInit(): void {
    this.cartSubscription = this.cartService.getCartItems().subscribe(cartItems => {
      this.totalCartCount = cartItems.length;
    });
  }

  ngOnDestroy(): void {
    if (this.cartSubscription) {
      this.cartSubscription.unsubscribe();
    }
  }

  }
