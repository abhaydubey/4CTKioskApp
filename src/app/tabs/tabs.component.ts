
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss']
})
export class TabsComponent implements OnInit {

  cartItems = [];
  cartCount = 0;

  ngOnInit() {
    let that = this;
    document.addEventListener('cartChange', function() {
      that.loadCartItems();
    }, true);

    
    this.loadCartItems();
  }

  loadCartItems() {
    let that = this;
    this.authService.ajax({ 'REQ_TYPE': 'LOAD_CART_ITEMS'}, function (res) {
      that.cartItems = res;
      let count = 0;
      for(let i = 0; i < that.cartItems.length; i++) {
        count += that.cartItems[i].count;
      }
      that.cartCount = count;
    });
  }

  constructor(private authService: AuthenticationService,
   
    public router: Router) {
    console.log('TODO.TabsPage.constructor');
  }
  logout() {
    this.authService.logout();
    //this.menuCtrl.close('mainMenu');
    this.router.navigateByUrl( 'register' );
    // this.goHome();
  }


  goToCart() {
    document.dispatchEvent(new CustomEvent('refreshCart', { detail: {} }));
    this.router.navigateByUrl( 'tabs/cart' );
  }
}

