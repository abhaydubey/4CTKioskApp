import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material/material.module';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { CartComponent } from './cart/cart.component';
import { AccountComponent } from './account/account.component';
import { HomeComponent } from './home/home.component';
import { SettingComponent } from './setting/setting.component';
import { TabsComponent } from './tabs/tabs.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    CartComponent,
    AccountComponent,
    HomeComponent,
    SettingComponent,
    TabsComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
