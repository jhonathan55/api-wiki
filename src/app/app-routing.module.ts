import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  { path: 'shearch', loadChildren: () => import('./pages/shearch/shearch.module').then(m => m.ShearchModule) },
  
  { path: 'login', loadChildren: () => import('./auth/login/login.module').then(m => m.LoginModule) },
  
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
