import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Routes, Router } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
PlotlyModule.plotlyjs = PlotlyJS;

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { EinnahmeComponent } from './components/einnahme/einnahme.component';
import { EinnahmeService } from './services/einnahme.service';
import { AusgabeComponent } from './components/ausgabe/ausgabe.component';
import { SearchComponent } from './components/search/search.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { AusgabeService } from './services/ausgabe.service';
import { KostenrechnungComponent } from './components/kostenrechnung/kostenrechnung.component';
import { KostenrechnungService } from './services/kostenrechnung.service';
import { ScatterplotComponent } from './graphics/scatterplot/scatterplot.component';
import { LoginComponent } from './components/login/login.component';
import { LoginStatusComponent } from './components/login-status/login-status.component';

import { OktaAuth } from '@okta/okta-auth-js';
import { OKTA_CONFIG, OktaAuthModule, OktaCallbackComponent, OktaAuthGuard } from '@okta/okta-angular';
import AppConfig from './config/app-config';

const oktaConfig = Object.assign({
  onAuthRequired: (oktaAuth, injector) => {
    const router = injector.get(Router);
    // Redirect the user to your custom login page
    router.navigate(['/login']);
  }
}, AppConfig.oidc);

const oktaAuth = new OktaAuth(oktaConfig);

const routes: Routes = [
  {path: 'login/callback', component: OktaCallbackComponent},
  {path: 'login', component: LoginComponent},

  {path: 'home', component: HomeComponent},
  {path: 'einnahmen', component: EinnahmeComponent, canActivate: [OktaAuthGuard]},
  {path: 'ausgaben', component: AusgabeComponent, canActivate: [OktaAuthGuard]},
  {path: 'kostenrechnung', component: KostenrechnungComponent, canActivate: [OktaAuthGuard]},
  {path: 'einnahmen/search/:keyword', component: EinnahmeComponent, canActivate: [OktaAuthGuard]},
  {path: 'ausgaben/search/:keyword', component: AusgabeComponent, canActivate: [OktaAuthGuard]},
  {path: 'einnahmen/searchbydatum/:datum', component: EinnahmeComponent, canActivate: [OktaAuthGuard]},
  {path: 'ausgaben/searchbydatum/:datum', component: AusgabeComponent, canActivate: [OktaAuthGuard]},
  {path: 'kostenrechnung/searchbydatum/:datum', component: KostenrechnungComponent, canActivate: [OktaAuthGuard]},
  {path: 'einnahmen/cancel', component: EinnahmeComponent, canActivate: [OktaAuthGuard]},
  {path: 'ausgaben/cancel', component: AusgabeComponent, canActivate: [OktaAuthGuard]},
  {path: 'kostenrechnung/cancel', component: KostenrechnungComponent, canActivate: [OktaAuthGuard]},
  {path: '', redirectTo: '/home', pathMatch:'full'},
  {path: '**', redirectTo: '/home', pathMatch:'full'},
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SearchComponent,
    DatepickerComponent,
    EinnahmeComponent,
    AusgabeComponent,
    KostenrechnungComponent,
    ScatterplotComponent,
    LoginComponent,
    LoginStatusComponent,
  ],
  imports: [
    RouterModule.forRoot(routes),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule,
    NgbModule,
    CommonModule,
    PlotlyModule,
    MatTabsModule,
    OktaAuthModule
  ],
  providers: [EinnahmeService, AusgabeService, KostenrechnungService,
    { provide: OKTA_CONFIG, useValue: {oktaAuth} }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
