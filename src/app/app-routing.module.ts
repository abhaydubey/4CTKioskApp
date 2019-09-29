import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  { path: '', loadChildren: './dashboard/dashboard.module#DashboardModule' },
  { path: 'dashboard', loadChildren: './dashboard/dashboard.module#DashboardModule' },
  { path: 'tabs', loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsModule) },  
  { path: 'register', loadChildren: './auth/register/register.module#RegisterModule' },
  { path: 'login', loadChildren: './login/login.module#LoginModule' },
  { path: 'thankyou', loadChildren: './thankyou/thankyou.module#ThankyouModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
