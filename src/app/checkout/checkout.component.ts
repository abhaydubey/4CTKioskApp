import { Router } from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import * as $ from 'jquery';
import * as firebase from 'firebase';
import * as firebaseui from 'firebaseui';
const passwordRegEx = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&#].{8,}';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  public sent: boolean;
  public isVerified=false;
 
  constructor(private router: Router) {
    this.initApp();
    const config = {
      apiKey: "AIzaSyA7IXmV8R9Xa-5LdzXZglBXbxZbrD0C64M",
      authDomain: "fir-authmobile-86ef5.firebaseapp.com",
      databaseURL: "https://fir-authmobile-86ef5.firebaseio.com",
      projectId: "fir-authmobile-86ef5",
      storageBucket: "fir-authmobile-86ef5.appspot.com",
      messagingSenderId: "399173827521",
      appId: "1:399173827521:web:1c6e89144fd7474c0f8d40"
    };
    
        firebase.initializeApp(config);
   
  }
  ngOnInit(){
    
  }

  
  getUiConfig =function(){
    return {
      'callbacks': {
        // Called when the user has been successfully signed in.
        'signInSuccess': function(user, credential, redirectUrl) {
          this.handleSignedInUser(user);
          // Do not redirect.
          return false;
        }
      },
      // Opens IDP Providers sign-in flow in a popup.
      'signInFlow': 'popup',
      'signInOptions': [
        // The Provider you need for your app. We need the Phone Auth
        {
          provider: firebase.auth.PhoneAuthProvider.PROVIDER_ID,
          recaptchaParameters: {
            type: 'image',
            size: 'invisible',
            badge: 'bottomleft'
          }
        }
      ],
      // Terms of service url.
      'tosUrl': 'https://www.google.com'
    };
  }
  
  ui = new firebaseui.auth.AuthUI(firebase.auth());
  
  handleSignedInUser = function(user) {
    var a =10;
  };
  
  
  handleSignedOutUser = function() {
    this.ui.start('#firebaseui-container', this.getUiConfig());
  };
  
  // Listen to change in auth state so it displays the correct UI for when
  // the user is signed in or not.

  temp = function() {
    firebase.auth().onAuthStateChanged((user: any)=>
  {
    // document.getElementById('loading').style.display = 'none';
    // document.getElementById('loaded').style.display = 'block';
    user ? this.handleSignedInUser(user) : this.handleSignedOutUser();
  }
  );
  };
  
  
  
  initApp = function() {
    document.getElementById('sign-out').addEventListener('click', function() {
      firebase.auth().signOut();
    });
  };
  




  pay(){


//alert("Order Placed");


  }

}
