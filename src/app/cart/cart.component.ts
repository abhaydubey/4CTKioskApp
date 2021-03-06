import { HomeComponent } from '../home/home.component';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery'

@Component({
  selector: 'app-cart',
  templateUrl: 'cart.component.html',
  styleUrls: ['cart.component.scss']
})
export class CartComponent implements OnInit, AfterViewInit {

  cartItems = [];
  vendorItems = [];
  vendorDetails = [];
  groupedItems = [];
  totalPrice = 0;
  paymentMode="Cash";
  showPayment=true;
  slideOpts = {
    initialSlide: 0,
    speed: 400
  };

  ngAfterViewInit() {
    this.refreshCart();
  }

  constructor(private authService: AuthenticationService,
    public router: Router) {
   
  }

  ngOnInit() {
    let that = this;
    this.refreshCart();
    document.addEventListener('refreshCart', function() {
      that.refreshCart();
    }, true);
  }



  refreshCart() {
    let that = this;
    this.authService.ajax({ 'REQ_TYPE': 'LOAD_CART_ITEMS'}, function (res) {
      that.cartItems = res;
      let itemIds = [];
      for(let i = 0; i < that.cartItems.length; i++) {
        itemIds.push(that.cartItems[i].itemId);
      }
      that.authService.ajax({ 'REQ_TYPE': 'ITEMS_BY_IDS', 'ITEM_IDS': itemIds.toString()}, function (res) {
        that.vendorItems = res;
        let vendorIds = [];
        for(let j = 0; j < that.vendorItems.length; j++) {
          vendorIds.push(that.vendorItems[j].vendorId);
        }
        that.authService.ajax({ 'REQ_TYPE': 'VENDORS_BY_IDS', 'VENDOR_IDS': vendorIds.toString()}, function (res) {
          that.vendorDetails = res;
          for(let k = 0; k < that.vendorDetails.length; k++) {
            for(let l = 0; l < that.cartItems.length; l++) {
              if(that.cartItems[l].vendorId == that.vendorDetails[k].id) {
                that.cartItems[l].vendor = that.vendorDetails[k];
              }
            }
          }
          HomeComponent.mapCartCountForItems(that.vendorItems, that.cartItems);
          that.groupCartItems();
        });
      });
    });
  }

  groupCartItems() {
    let tempGroup = {};
    let groupArray = [];
    let tempTotalPrice = 0;
    for(let i = 0; i < this.cartItems.length; i++) {
      let idStr = ''+this.cartItems[i].vendorId;
      if(!tempGroup[idStr]) {
        tempGroup[idStr] = {items: [], total: 0};
      }
      tempGroup[idStr].name = this.cartItems[i].vendor.fullName;
      tempGroup[idStr].id = this.cartItems[i].vendor.id;
      tempGroup[idStr].items.push(this.cartItems[i]);
      tempGroup[idStr].count += this.cartItems[i].count;
      tempGroup[idStr].total += (this.cartItems[i].item.itemPrice * this.cartItems[i].count);
      tempTotalPrice += (this.cartItems[i].item.itemPrice * this.cartItems[i].count);
    }
    for(let key in tempGroup) {
      groupArray.push(tempGroup[key]);
    }
    this.totalPrice = tempTotalPrice;
    this.groupedItems = groupArray;
    console.log(this.groupedItems);
  }

  removeFromCart(item) {
    let that = this;
    let cartItemId = null;
    for(let index = 0; index < this.cartItems.length; index++) {
      if(this.cartItems[index].itemId == item.id) {
        cartItemId = this.cartItems[index].id;
      }
    }
    this.authService.ajax({ 'REQ_TYPE': 'REMOVE_FROM_CART', "cartItemId": cartItemId }, function (res) {
      that.refreshCart();
      document.dispatchEvent(new CustomEvent('cartChange', { detail: {} }));
    });
  }

  addToCart(item) {
    let that = this;
    this.authService.ajax({ 'REQ_TYPE': 'ADD_TO_CART', "itemId": item.id }, function (res) {
      that.refreshCart();
      document.dispatchEvent(new CustomEvent('cartChange', { detail: {} }));
    });
  }

  placeOrder() {    
    let that = this;
    let vendorIds = [];
    for(let index = 0; index < this.groupedItems.length; index++) {
      vendorIds.push(this.groupedItems[index].id);
    }    
    this.placeOrders(vendorIds);
  }

  placeOrderForVendorID(vendorId) {
    this.placeOrders([vendorId]);
  }

  placeOrders(vendorIds) {
    let that = this;
    this.authService.ajax({
      'REQ_TYPE': 'PLACE_ORDER_BY_VENDOR_ID', 
      "VENDOR_IDS": vendorIds.toString(),
      "PAYMENT_REF" : "CASH",
      "PAYMENT_TYPE" : "CASH",
      "AMOUNT":  that.totalPrice,
      "NOTES": "COD_ORDER"
    }, function (res) {
      that.refreshCart();
     
      document.dispatchEvent(new CustomEvent('cartChange', { detail: {} }));     
         
      
     
      
      setTimeout(()=>{if(document.getElementById("ignismyModalClose")){
        document.getElementById("ignismyModalClose").click();
      } },1000)
     setTimeout(() => {
      that.goToThankyou()
     }, 3000);
       
    }, function (error) {
      
    });
  }

  goToThankyou(){       
    this.router.navigateByUrl("thankyou");
  }

  

  goToShopping(){
    this.router.navigateByUrl("tabs/tabs/home");
  }

  getFullImagePath(i) {
    return i.imagePath ? AuthenticationService.CONTEXT_URL + i.imagePath : 'assets/images/no-image.png';
  }

}
