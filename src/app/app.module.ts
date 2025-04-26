import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth'; // ✅ Needed for compat version

import { provideFirebaseApp, initializeApp } from '@angular/fire/app'; // ✅ Modular init
import { provideAuth, getAuth } from '@angular/fire/auth'; // ✅ Modular Auth provider

import { firebaseConfig } from './environment';
import { MarqueformComponent } from './marqueform/marqueform.component';

import { MatTableModule } from '@angular/material/table';

// Cloudinary
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
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { AdminsidebarComponent } from './adminsidebar/adminsidebar.component';
import { DashboardComponent } from './dashboard/dashboard.component';

import { provideCharts } from 'ng2-charts';
import { BaseChartDirective } from 'ng2-charts';
import { DashboardsidebarComponent } from './dashboardsidebar/dashboardsidebar.component';
import { DashboardvusComponent } from './dashboardvus/dashboardvus.component';
import { DashboardfavorisComponent } from './dashboardfavoris/dashboardfavoris.component';
import { DashboardcomparisonsComponent } from './dashboardcomparisons/dashboardcomparisons.component';



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
    VoituredetailsComponent,
    NavbarComponent,
    FooterComponent,
    AdminsidebarComponent,
    DashboardComponent,
    DashboardsidebarComponent,
    DashboardvusComponent,
    DashboardfavorisComponent,
    DashboardcomparisonsComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,

    // ✅ Firebase setup
    AngularFireModule.initializeApp(firebaseConfig), // compat
    AngularFireAuthModule, // compat auth module

    // ✅ Modular Firebase setup for inject(Auth), authState, etc.
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideAuth(() => getAuth()),

    MatTableModule,

    BaseChartDirective,
  ],
  providers: [
    {
      provide: Cloudinary,
      useFactory: () => new Cloudinary({ cloud: { cloudName: 'dzd8v4iwt' } })
    },
    provideCharts()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
