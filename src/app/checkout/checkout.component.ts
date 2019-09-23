import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { WindowService } from '../window.service';
import * as firebase from 'firebase';
import * as $ from 'jquery';


const passwordRegEx = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&#].{8,}';
export class PhoneNumber {
  country: string;
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
config={
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

  verificationCode: string;

  user: any;

  

  ngOnInit() {
    this.windowRef = this.win.windowRef
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container')

    this.windowRef.recaptchaVerifier.render();
   
  }


  sendLoginCode() {

    const appVerifier = this.windowRef.recaptchaVerifier;

    const num = this.phoneNumber.e164;

    firebase.auth().signInWithPhoneNumber(num, appVerifier)
            .then(result => {

                this.windowRef.confirmationResult = result;

            })
            .catch( error => console.log(error) );

  }

  verifyLoginCode() {
    this.windowRef.confirmationResult
                  .confirm(this.verificationCode)
                  .then( (result: any) => {

                    this.submitForm()

    })
    .catch( (error: any) => console.log(error, "Incorrect code entered?"));
  }

  pay(){
    
  }
  errorMsg="";
  isRegister=false;
  serverURL='https://equinoxcafeteria.azurewebsites.net';

  submitForm() {
    let area=this.phoneNumber.area;
    let that = this;
   
      $.ajax({
        type: "POST",
        url: this.serverURL + '/mobile/register',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          firstName: area,
          lastName: area,
          phone: area,
          email: area+'@gmail.com',
          password: area
        }),
        success: function (resp: any) {
          if(resp && resp.error && resp.error.length > 0) {
            that.errorMsg = resp.error.toString();
          } else {
            that.errorMsg = "";
            that.isRegister = false;
            this.login();
          }
        }, error: function (xhr, ajaxOptions, thrownError) {
          that.errorMsg = "Registration unsuccessful with error code: "+xhr.status;
          console.log('Registration Error xhr: ' + JSON.stringify(xhr) + ', ajax ' + JSON.stringify(ajaxOptions)
            + ', thrownError ' + JSON.stringify(thrownError));
        }
      });
    


   
  }

  login(){
    const accessToken = btoa(this.phoneNumber.area+'@gmail.com' + ':' + this.phoneNumber.area);
    this.authService.login(this.serverURL, accessToken, function (resp) {
      this.router.navigateByUrl('tabs/tabs/home');
    }, function (xhr, ajaxOptions, thrownError) {
      if('401' == xhr.status) {
        this.errorMsg = "Invalid credentials! Error code: "+xhr.status;
      } else if('403' == xhr.status) {
        this.errorMsg = "Access denied! Error code: "+xhr.status;
      } else {
        this.errorMsg = "Login error! Error code: "+xhr.status;
      }
      console.log('Login Error xhr: ' + JSON.stringify(xhr) + ', ajax ' + JSON.stringify(ajaxOptions)
        + ', thrownError ' + JSON.stringify(thrownError));
    });
  }
  





}
