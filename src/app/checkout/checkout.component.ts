import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { WindowService } from '../window.service';
import * as firebase from 'firebase';
import * as $ from 'jquery';


const passwordRegEx = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&#].{8,}';
export class PhoneNumber {
  country: string="91";
  area: string;

  get e164() {
    const num = this.country + this.area;
    return `+${num}`
  }

}
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

  constructor(private authService: AuthenticationService, private router: Router, private win: WindowService) {
  }
  config = {
    "apiKey": "AIzaSyA7IXmV8R9Xa-5LdzXZglBXbxZbrD0C64M",
    "authDomain": "fir-authmobile-86ef5.firebaseapp.com",
    "databaseURL": "https://fir-authmobile-86ef5.firebaseio.com",
    "projectId": "fir-authmobile-86ef5",
    "storageBucket": "fir-authmobile-86ef5.appspot.com",
    "messagingSenderId": "399173827521",
    "appId": "1:399173827521:web:1c6e89144fd7474c0f8d40"
  }
  windowRef: any;

  phoneNumber = new PhoneNumber()
  IsValidNumber=true;
  verificationCode: string;

  user: any;

  appVerifier: any;


  ngOnInit() {
    this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')

    this.appVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      'size': 'invisible',
      'badge': 'bottomleft'
    });
  }

  IsNumberValid(){
    if( this.phoneNumber.area ==null || this.phoneNumber.area=='' || this.phoneNumber.area.toString().length!=10){
this.IsValidNumber=false;
    }else{
      this.IsValidNumber=true;
    }
    return this.IsNumberValid;
  }
  sendLoginCode() {
    if(this.IsNumberValid()){
      const num = this.phoneNumber.e164;

      firebase.auth().signInWithPhoneNumber(num, this.appVerifier)
        .then(result => {
  
          this.windowRef.confirmationResult = result;
  
        })
        .catch(error => console.log(error));
    }

    

  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then((result: any) => {
        this.login(true);
      })
      .catch((error: any) =>{ 
        this.errorMsg=error;
        console.log(error, "Incorrect code entered?")
    });
  }


  errorMsg = "";
  isRegister = false;
  serverURL = 'https://equinoxcafeteria.azurewebsites.net';

  submitForm(IsCreateUser: boolean) {
    let area = this.phoneNumber.area;
    let that = this;
    let dat=area.toString();

    $.ajax({
      type: "POST",
      url: this.serverURL + '/register',
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify({
        firstName: dat,
        lastName: dat,
        phone: dat,
        email: dat + '@gmail.com',
        password: dat+'@123'
      }),
      success: function (resp: any) {
        if (resp && resp.error && resp.error.length > 0) {
          that.errorMsg = resp.error.toString();
        } else {
          that.errorMsg = "";
          that.isRegister = false;
          that.login(false);
        }
      }, error: function (xhr, ajaxOptions, thrownError) {
        that.errorMsg = "Registration unsuccessful with error code: " + xhr.status;
        console.log('Registration Error xhr: ' + JSON.stringify(xhr) + ', ajax ' + JSON.stringify(ajaxOptions)
          + ', thrownError ' + JSON.stringify(thrownError));
      }
    });
  }

  login(isCreateUser: boolean) {
    let that=this;
    const accessToken = btoa(this.phoneNumber.area.toString() + '@gmail.com' + ':' + this.phoneNumber.area.toString()+'@123');
    //const accessToken = btoa('bharatyadav311819@gmail.com' + ':' + 'Qwerty@123');
    this.authService.login(this.serverURL, accessToken, function (resp) {
      that.router.navigateByUrl('tabs/tabs/home');
    }, function (xhr, ajaxOptions, thrownError) {
      if ('401' == xhr.status) {
        if (isCreateUser) {
          that.submitForm(false);
        } else {
          this.errorMsg = "Invalid credentials! Error code: " + xhr.status;
        }

      } else if ('403' == xhr.status) {
        this.errorMsg = "Access denied! Error code: " + xhr.status;
      } else {
        this.errorMsg = "Login error! Error code: " + xhr.status;
      }
      console.log('Login Error xhr: ' + JSON.stringify(xhr) + ', ajax ' + JSON.stringify(ajaxOptions)
        + ', thrownError ' + JSON.stringify(thrownError));
    });
  }






}
