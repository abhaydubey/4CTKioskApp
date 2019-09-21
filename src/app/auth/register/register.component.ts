import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import * as $ from 'jquery';
const passwordRegEx = '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&#])[A-Za-z\d$@$!%*?&#].{8,}';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  form: FormGroup;
  isRegister: boolean = false;
  serverURL: string = 'https://equinoxcafeteria.azurewebsites.net';
  //serverURL: string = 'http://localhost:8080/cafeteria';
  errorMsg = "";

  constructor(private authService: AuthenticationService, private router: Router) {
    console.log('calling load');
    authService.checkToken(function (resp) {
      console.log('logged in successfully');
      router.navigateByUrl('tabs/tabs/home');
    }, function (error) {
      console.log('login error');
      this.isRegister = false;
    }).then(() => {
      console.log('loaded');
    }).catch((e) => {
      console.log('error');
    });
  }

  ngOnInit() {
    this.form = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.compose([
        Validators.required
        // , Validators.pattern('^[0-9]')
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(passwordRegEx)
      ])),
      confirmPassword: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern(passwordRegEx)
      ]))
    });
  }

  validatePhone(control: FormControl) {
    let x = this.form.get('phone').value;
    return this.isRegister && x && !isNaN(parseInt(x)) && (x.toString()).length == 10;
  }

  get firstName() {
    return this.form.get('firstName');
  }

  get lastName() {
    return this.form.get('lastName');
  }

  get password() {
    return this.form.get('password');
  }

  get confirmPassword() {
    return this.form.get('confirmPassword');
  }

  get phone() {
    return this.form.get('phone');
  }

  get email() {
    return this.form.get('email');
  }

  passwordMatches(control: FormControl) {
    return this.isRegister ? this.form.get('password').value === this.form.get('confirmPassword').value : !!this.form.get('password').value;
  }

  submitForm() {
    console.log(JSON.stringify(this.form.value));
    let that = this;
    if (this.isRegister) {
      $.ajax({
        type: "POST",
        url: this.serverURL + '/mobile/register',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify({
          firstName: this.form.value.firstName,
          lastName: this.form.value.lastName,
          phone: '' + this.form.value.phone,
          email: this.form.value.email,
          password: this.form.value.password
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
      const accessToken = btoa(this.form.value.email + ':' + this.form.value.password);
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

  formValid() {
    return this.isRegister ? (this.form.valid && this.passwordMatches(null) && this.validatePhone(null)) :
      (this.email.value && this.password.value);
  }

  loginOrRegister() {
    this.errorMsg = "";
    this.isRegister = !this.isRegister;
  }
}
