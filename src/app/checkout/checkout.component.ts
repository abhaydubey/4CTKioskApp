import { Router } from '@angular/router';

import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import * as $ from 'jquery';
import * as firebase from 'firebase';
const passwordRegEx = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&#].{8,}';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

  public recaptchaVerifier: firebase.auth.RecaptchaVerifier;
  public sent: boolean;
 
  constructor() {
    const firebaseConfig = {
      
    
     

      apiKey: "AIzaSyA7IXmV8R9Xa-5LdzXZglBXbxZbrD0C64M",
  authDomain: "fir-authmobile-86ef5.firebaseapp.com",
  databaseURL: "https://fir-authmobile-86ef5.firebaseio.com",
  projectId: "fir-authmobile-86ef5",
  storageBucket: "fir-authmobile-86ef5.appspot.com",
  messagingSenderId: "399173827521"//,
  //appId: "1:399173827521:web:1c6e89144fd7474c0f8d40"
    };
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
  }
 
  ngOnInit() {
    this.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container');
  }
 
  onSubmit(formData) {
    const appVerifier = this.recaptchaVerifier;
    const phoneNumberString = "+"+formData.phone_number.toString();
 
    firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
      .then((confirmationResult) => {
        this.sent = true;
        const verification = prompt('Enter verification code');
        if (verification != null) {
          console.log(verification);
          confirmationResult.confirm(verification)
            .then((good) => {
              alert("verified");
            })
            .catch((bad) => {
              // code verification was bad.
            });
        } else {
          console.log('No verification code entered');
        }
      })
      .catch((err) => {
        console.log('sms not sent', err);
      });
  };

}
