import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire/compat';
import { firebaseConfig } from './environment';
import { LoginComponent } from './login/login.component';
import { MarqueformComponent } from './marqueform/marqueform.component';

import {MatTableModule} from '@angular/material/table';

// Import Cloudinary Modules
import { Cloudinary } from '@cloudinary/url-gen';
import { MarqueComponent } from './marque/marque.component';
import { VoitureComponent } from './voiture/voiture.component';
import { VoitureformComponent } from './voitureform/voitureform.component';
import { CompareformComponent } from './compareform/compareform.component';
import { ComparedetailsComponent } from './comparedetails/comparedetails.component';
import { HomepageComponent } from './homepage/homepage.component';
import { CarrosserieComponent } from './carrosserie/carrosserie.component';
import { CarrosserieformComponent } from './carrosserieform/carrosserieform.component';
import { VoituredetailsComponent } from './voituredetails/voituredetails.component';

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    MarqueformComponent,
    MarqueComponent,
    VoitureComponent,
    VoitureformComponent,
    CompareformComponent,
    ComparedetailsComponent,
    HomepageComponent,
    CarrosserieComponent,
    CarrosserieformComponent,
    VoituredetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    MatTableModule
  ],
  providers: [
    {
      provide: Cloudinary,
      useFactory: () => new Cloudinary({ cloud: { cloudName: 'dzd8v4iwt' } })
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }