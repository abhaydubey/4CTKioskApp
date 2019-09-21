import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: './auth/register/register.module#RegisterModule' },
  { path: 'tabs', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsModule) },
  { path: 'settings', loadChildren: './settings/settings.module#SettingsModule' },
  { path: 'register', loadChildren: './auth/register/register.module#RegisterModule' },
  { path: 'checkout', loadChildren: './checkout/checkout.module#CheckoutModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
