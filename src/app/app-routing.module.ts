import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { TabsComponent } from './tabs/tabs.component';
import { SettingComponent } from './setting/setting.component';
import { AccountComponent } from './account/account.component';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', component: RegisterComponent },
  {
    path: 'tabs', component: TabsComponent, children: [
      {
        path: 'account',
        children:[{
          path:'',
          component: AccountComponent,

        }]
      
      },
      {
        path: 'home',
        children:[{
          path:'',
          component:HomeComponent ,
          outlet: 'child'
        }]
       


      },
      {
        path: 'cart',
        children:[{
          path:'',
          component:CartComponent ,
          
        }]

      
       


      },
      {
        path: '',
        redirectTo: '/tabs/account',
        pathMatch: 'full'
      }
    ]

  },
  { path: 'settings', component: SettingComponent },
  { path: 'register', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
