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

const routes: Routes = [
  {
    path:'',
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
    pathMatch: 'full',
    component: MarqueformComponent
  },
  {
    path:'list-marques',
    pathMatch: 'full',
    component: MarqueComponent
  },
  {
    path:'list-voitures',
    pathMatch: 'full',
    component: VoitureComponent
  },
  {
    path:'ajouter-voiture',
    pathMatch: 'full',
    component: VoitureformComponent
  },
  {
    path:'voiture-details',
    pathMatch: 'full',
    component: VoituredetailsComponent
  },
  {
    path:'comparer',
    pathMatch: 'full',
    component: CompareformComponent
  },
  {
    path:'comparison-result',
    pathMatch: 'full',
    component: ComparedetailsComponent
  },
  {
    path:'ajouter-carrosserie',
    pathMatch: 'full',
    component: CarrosserieformComponent
  },
  {
    path:'list-carrosseries',
    pathMatch: 'full',
    component: CarrosserieComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
