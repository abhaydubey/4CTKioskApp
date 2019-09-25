import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';


import { ThankyouComponent } from './thankyou.component';

const routes: Routes = [
  {
    path: '',
    component: ThankyouComponent
  }
];

@NgModule({
  imports: [
    CommonModule,      
    RouterModule.forChild(routes),  
    
  ],
  declarations: [ThankyouComponent]
})
export class ThankyouModule {
 
 
    
  
}
