import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import * as $ from 'jquery';
const passwordRegEx = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&#].{8,}';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {

  constructor(private authService: AuthenticationService, private router: Router) { 
  }
  ngOnInit(){
    
  }

  pay(){
    
  }
  errorMsg="";
  isRegister=false;
  serverURL='https://equinoxcafeteria.azurewebsites.net';

  submitForm(phoneNumber) {
   
    let that = this;
    if (this.isRegister) {
      $.ajax({
        type: "POST",
        url: this.serverURL + '/mobile/register',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          firstName: phoneNumber,
          lastName: phoneNumber,
          phone: phoneNumber,
          email: phoneNumber+'@gmail.com',
          password: phoneNumber
        }),
        success: function (resp: any) {
          if(resp && resp.error && resp.error.length > 0) {
            that.errorMsg = resp.error.toString();
          } else {
            that.errorMsg = "";
            that.isRegister = false;
          }
        }, error: function (xhr, ajaxOptions, thrownError) {
          that.errorMsg = "Registration unsuccessful with error code: "+xhr.status;
          console.log('Registration Error xhr: ' + JSON.stringify(xhr) + ', ajax ' + JSON.stringify(ajaxOptions)
            + ', thrownError ' + JSON.stringify(thrownError));
        }
      });
    } else {
      const accessToken = btoa(phoneNumber+'@gmail.com' + ':' + phoneNumber);
      this.authService.login(this.serverURL, accessToken, function (resp) {
        that.router.navigateByUrl('tabs/tabs/home');
      }, function (xhr, ajaxOptions, thrownError) {
        if('401' == xhr.status) {
          that.errorMsg = "Invalid credentials! Error code: "+xhr.status;
        } else if('403' == xhr.status) {
          that.errorMsg = "Access denied! Error code: "+xhr.status;
        } else {
          that.errorMsg = "Login error! Error code: "+xhr.status;
        }
        console.log('Login Error xhr: ' + JSON.stringify(xhr) + ', ajax ' + JSON.stringify(ajaxOptions)
          + ', thrownError ' + JSON.stringify(thrownError));
      });
    }
  }


  





}
