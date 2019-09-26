import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import * as firebase from 'firebase';

import { LoginComponent } from './login.component';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,    
    RouterModule.forChild(routes),    
    ReactiveFormsModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule {
  constructor() {
    const config = {
      apiKey: 'AIzaSyA7IXmV8R9Xa-5LdzXZglBXbxZbrD0C64M',
      authDomain: 'fir-authmobile-86ef5.firebaseapp.com',
      databaseURL: 'https://fir-authmobile-86ef5.firebaseio.com',
      projectId: 'fir-authmobile-86ef5',
      storageBucket: 'fir-authmobile-86ef5.appspot.com',
      messagingSenderId: '399173827521',
      appId: '1:399173827521:web:1c6e89144fd7474c0f8d40'
    };
    // let app1 = firebase.app();
    // app1.delete();
    firebase.initializeApp(config);
  }
}
