import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { MarqueformComponent } from './marqueform/marqueform.component';
import { MarqueComponent } from './marque/marque.component';
import { VoitureComponent } from './voiture/voiture.component';
import { VoitureformComponent } from './voitureform/voitureform.component';
import { VoituredetailsComponent } from './voituredetails/voituredetails.component';
import { ComparedetailsComponent } from './comparedetails/comparedetails.component';
import { CompareformComponent } from './compareform/compareform.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CarrosserieComponent } from './carrosserie/carrosserie.component';
import { CarrosserieformComponent } from './carrosserieform/carrosserieform.component';
import { authGuard } from './auth.guard';

// [() => authGuard()] // Anyone logged in can access
// [() => authGuard('admin')]
// [() => authGuard('user')] // USER AND IS NOT ADMIN

const routes: Routes = [
  {
    path:'',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path:'home',
    pathMatch: 'full',
    component: HomepageComponent
  },
  {
    path:'login',
    pathMatch: 'full',
    component: LoginComponent
  },
  {
    path:'register',
    pathMatch: 'full',
    component: RegisterComponent
  },
  {
    path:'ajouter-marque',
    canActivate:  [() => authGuard('admin')],
    component: MarqueformComponent
  },
  {
    path:'list-marques',
    canActivate:  [() => authGuard('admin')],
    component: MarqueComponent
  },
  {
    path:'list-voitures',
    canActivate:  [() => authGuard('admin')],
    component: VoitureComponent
  },
  {
    path:'ajouter-voiture',
    canActivate:  [() => authGuard('admin')],
    component: VoitureformComponent
  },
  {
    path:'voiture-details',
    canActivate:  [() => authGuard()],
    component: VoituredetailsComponent
  },
  {
    path:'comparer',
    canActivate:  [() => authGuard()],
    component: CompareformComponent
  },
  {
    path:'comparison-result',
    canActivate:  [() => authGuard()],
    component: ComparedetailsComponent
  },
  {
    path:'ajouter-carrosserie',
    canActivate:  [() => authGuard('admin')],
    component: CarrosserieformComponent
  },
  {
    path:'list-carrosseries',
    canActivate:  [() => authGuard('admin')],
    component: CarrosserieComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
