import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';


import { CheckoutComponent } from './checkout.component';

const routes: Routes = [
  {
    path: '',
    component: CheckoutComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,    
    RouterModule.forChild(routes),    
    ReactiveFormsModule
  ],
  declarations: [CheckoutComponent]
})
export class CheckoutModule {}
