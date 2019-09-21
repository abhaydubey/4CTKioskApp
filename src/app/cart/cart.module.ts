import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartComponent } from './cart.component';

@NgModule({
  imports: [    
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: CartComponent }])
  ],
  declarations: [CartComponent]
})
export class CartModule {}
