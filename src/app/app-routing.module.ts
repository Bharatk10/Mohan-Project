import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ItgrcComponent } from './itgrc/itgrc.component';
import { ConsumerIpComponent } from './consumer-ip/consumer-ip.component';
import { ConsumerComponent } from './consumer/consumer.component';
import { DataServicesComponent } from './data-services/data-services.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthGuard } from './guard/auth.guard';

const routes: Routes = [

  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent},
  {path: 'home',component:HomeComponent,canActivate:[AuthGuard]},
  {path:'itgrc',component:ItgrcComponent,canActivate:[AuthGuard]},
  {path:'consumerIp',component:ConsumerIpComponent,canActivate:[AuthGuard]},
  {path:'consumer',component:ConsumerComponent,canActivate:[AuthGuard]},
  {path:'data-services',component:DataServicesComponent,canActivate:[AuthGuard]},
  { path: 'not-found', component: NotFoundComponent }, 
  { path: '**', redirectTo: '/not-found' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
