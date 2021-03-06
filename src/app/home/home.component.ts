import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit {

  title: string = 'Cafeteria';
  vendors: any = [];
  allVendors: any = [];
  items: any = [];
  allItems: any = [];
  cartItems: any = [];
  searchKey: string = '';
  searchPlaceholder: string;
  selectedVendor=null;
  cartCount=0;
  totalPrice=0;

  ngOnInit() {
    let that = this;
    this.authService.ajax({ 'REQ_TYPE': 'LOAD_CART_ITEMS' }, function (res) {
      that.cartItems = res;
      let count = 0;
      for(let i = 0; i < that.cartItems.length; i++) {
        count += that.cartItems[i].count;
      }
      that.cartCount = count;
      that.cafeteriaClick();
    });   
  }

  constructor(private authService: AuthenticationService, private router: Router) {
    this.title = 'Cafeteria';
  }

  isInServices() {
    return this.title == 'Services';
  }

  isInVendors() {
    return this.title == 'Cafeteria';
  }

  isInItems() {
    return this.title == 'Items';
  }



  cafeteriaClick() {
    let that = this;
    this.title = 'Cafeteria';
    this.searchPlaceholder = 'Search Shops';
    this.authService.ajax({ 'REQ_TYPE': 'VENDOR_LIST' }, function (res) {
      that.allVendors = res;
      that.vendors = res.filter((x)=>{
        return (that.cartCount==0 || (that.cartCount>0 &&  x.id==that.cartItems[0].vendorId))
       });
    });
  }

  selectVendor(v) {
    let that = this;
    this.selectedVendor=v
    this.title = 'Items';
    this.searchPlaceholder = 'Search Items';
    this.searchKey = '';
    this.authService.ajax({ 'REQ_TYPE': 'ITEM_LIST', 'vendorId': v.id }, function (res) {
      that.allItems = res.records;
      that.items = res.records;
      HomeComponent.mapCartCountForItems(that.allItems, that.cartItems);
      that.totalPrice=0;
      that.cartCount=0;
      for (let i = 0; i < that.allItems.length; i++) {
        that.totalPrice+=(that.allItems[i].itemPrice* that.allItems[i].cartCount);
        that.cartCount += that.allItems[i].cartCount;
      }
      
    });
  }

  static mapCartCountForItems(items, cart) {
    let map = {};
    let count=0;
    let totalPrice=0;
    for (let i = 0; i < items.length; i++) {
      items[i].cartCount = 0;
      for (let j = 0; j < cart.length; j++) {
        if (items[i].id == cart[j].itemId) {
          items[i].cartCount = cart[j].count;
          cart[j].item = items[i];       
        }
      }     
    }   
  }

  getFullImagePath(i) {
    return i.imagePath ? AuthenticationService.CONTEXT_URL + i.imagePath : 'assets/images/no-image.png';
  }

  addToCart(i) {
    let that = this;
    this.authService.ajax({ 'REQ_TYPE': 'ADD_TO_CART', "itemId": i.id }, function (res) {
      that.cartItems = res;
      
     
      HomeComponent.mapCartCountForItems(that.allItems, that.cartItems);
      that.totalPrice=0;
      that.cartCount=0;
      for (let i = 0; i < that.allItems.length; i++) {
        that.totalPrice+=(that.allItems[i].itemPrice* that.allItems[i].cartCount);
        that.cartCount += that.allItems[i].cartCount;
      }
      document.dispatchEvent(new CustomEvent('cartChange', { detail: {} }));
    });
  }

  isInCart(item) {
    for (let index = 0; index < this.cartItems.length; index++) {
      if (this.cartItems[index].itemId == item.id) {
        return true;
      }
    }
    return false;
  }

  removeFromCart(item) {
    let that = this;
    let cartItemId = null;
    for (let index = 0; index < this.cartItems.length; index++) {
      if (this.cartItems[index].itemId == item.id) {
        cartItemId = this.cartItems[index].id;
      }
    }
    this.authService.ajax({ 'REQ_TYPE': 'REMOVE_FROM_CART', "cartItemId": cartItemId }, function (res) {
      that.cartItems = res;
      
      HomeComponent.mapCartCountForItems(that.allItems, that.cartItems);
      that.totalPrice=0;
      that.cartCount=0;
      for (let i = 0; i < that.allItems.length; i++) {
        that.totalPrice+=(that.allItems[i].itemPrice* that.allItems[i].cartCount);
        that.cartCount += that.allItems[i].cartCount;
      }
      document.dispatchEvent(new CustomEvent('cartChange', { detail: {} }));
    });
  }

  filterItems(e) {
    let searchStr = e.target.value ? e.target.value : '';
    if (this.isInItems()) {
      this.items = this.allItems.filter(item => {
        let result = item.itemName.toLowerCase().indexOf(searchStr.toLowerCase()) > -1;
        console.log('     ' + item.itemName + ' => ' + result);
        return result;
      });
    } else if (this.isInVendors()) {
      console.log('searching vendors');
      this.vendors = this.allVendors.filter(vendor => {
        let result = vendor.fullName.toLowerCase().indexOf(searchStr.toLowerCase()) > -1;
        console.log('     ' + vendor.fullName + ' => ' + result);
        return result;
      });
    }
  }

  customBackButtonClick() {
    if (this.isInItems()) {
      this.items = [];
      this.allItems = [];
      this.title = 'Cafeteria';
      let that=this;
      this.vendors = this.allVendors.filter((x)=>{
       return (that.cartCount==0 || (that.cartCount>0 &&  x.id==that.cartItems[0].vendorId))
      });
      this.searchKey = '';
      this.searchPlaceholder = 'Search Shops';
    } 
  }

  goToCart() {
    document.dispatchEvent(new CustomEvent('refreshCart', { detail: {} }));
    this.router.navigateByUrl( 'tabs/tabs/cart' );
  }
}
