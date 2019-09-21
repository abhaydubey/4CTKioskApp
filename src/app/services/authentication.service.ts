import { Router } from '@angular/router';

import { Injectable } from '@angular/core';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { BehaviorSubject } from 'rxjs';
const AUTH_DETAILS = 'authetication';
import * as $ from 'jquery';
import { RegisterComponent } from '../auth/register/register.component';
@Injectable({
  providedIn: 'root'
})

export class AuthenticationService {
  // public static SERVER_URL = '';
  public static CONTEXT_URL = '';
  authenticationState = new BehaviorSubject(false);
  constructor(private storage: LocalStorage, 
    public router: Router) {
   
      this.checkToken();
   
  }

  checkToken(successFn?, errorFn?) {
    return new Promise((resolve, reject) => {
      this.storage.getItem(AUTH_DETAILS)
        .subscribe((res:any) => {
          if (res) {
            let authObj = JSON.parse(res);
            // this.authenticationState.next(true);
            this.login(authObj.serviceUrl, authObj.accessToken, successFn);
          }
          resolve(res);
        }, error => {
          reject(error);
          if(errorFn) {
            errorFn(error);
          }
        });
    });
  }

  ajax(data, successFn?, errorFn?) {
    return new Promise((resolve, reject) => {
      this.storage.getItem(AUTH_DETAILS)
        .subscribe((res:any) => {
          if (res) {
            let authObj = JSON.parse(res);
            this.requestData(JSON.stringify(data), authObj.serviceUrl, authObj.accessToken, successFn, errorFn);
          }
          resolve(res);
        },error => {
          reject(error);
          if(errorFn) {
            errorFn(error);
          }
        });
    });
  }

  login(serverURL, accessToken, successFn? : Function, errorFn? : Function) {
    // const accessToken = btoa(username + ':' + password);
    // const token = 'Bearer ' + accessToken;
    if(serverURL.indexOf('/mobile/ajax') > 0) {
      AuthenticationService.CONTEXT_URL = serverURL.substring(0, serverURL.indexOf('/mobile/ajax'));
    } else {
      AuthenticationService.CONTEXT_URL = serverURL;
    }
    this.requestData(JSON.stringify({'REQ_TYPE': 'LOGIN_DETAILS'}), serverURL + '/mobile/ajax', accessToken, successFn, errorFn, true);
    // return this.storage.set(TOKEN_KEY, token).then(() => {
    //   this.authenticationState.next(true);
    // });
  }

  requestData(data, serverURL, accessToken, successFn?, errorFn?, storeCredentials?) {
    let that = this;
    $.ajax({
      type: "POST",
      url: serverURL,
      dataType: 'json',
      contentType: 'application/json',
      headers: {
        "Authorization": "Basic " + accessToken,
        "Cafeteria-App": "true"
      },
      data: data,
      success: function (resp: any) {
        // that.storage.set(TOKEN_KEY, accessToken).then(() => {
        //   that.authenticationState.next(true);
        // });
        if(storeCredentials) {
          that.storage.setItem(AUTH_DETAILS, JSON.stringify({accessToken : accessToken, serviceUrl: serverURL})).subscribe(() => {
            console.log('data store successfully');
          });
          }
        if(successFn) {
          successFn(resp);
        }
      },
      error: function (xhr, ajaxOptions, thrownError) {
        if(errorFn) {
          errorFn(xhr, ajaxOptions, thrownError);
        }
      }
    });
  }

  logout() {
    return this.storage.removeItem(AUTH_DETAILS).subscribe(() => {
      this.authenticationState.next(false);
    });
  }

  isAuthenticated() {
    return new Promise((resolve, reject) => {
      this.checkToken()
        .then(res => {
          resolve(this.authenticationState.value);
        })
        .catch(error => {
          reject(error);
        });
    });
  }
}