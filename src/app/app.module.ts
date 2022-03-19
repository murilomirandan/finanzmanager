import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

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

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'einnahmen', component: EinnahmeComponent},
  {path: 'ausgaben', component: AusgabeComponent},
  {path: 'kostenrechnung', component: KostenrechnungComponent},
  {path: 'einnahmen/search/:keyword', component: EinnahmeComponent},
  {path: 'ausgaben/search/:keyword', component: AusgabeComponent},
  {path: 'einnahmen/searchbydatum/:datum', component: EinnahmeComponent},
  {path: 'ausgaben/searchbydatum/:datum', component: AusgabeComponent},
  {path: 'kostenrechnung/searchbydatum/:datum', component: KostenrechnungComponent},
  {path: 'einnahmen/cancel', component: EinnahmeComponent},
  {path: 'ausgaben/cancel', component: AusgabeComponent},
  {path: 'kostenrechnung/cancel', component: KostenrechnungComponent},
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
  ],
  providers: [EinnahmeService, AusgabeService, KostenrechnungService],
  bootstrap: [AppComponent]
})
export class AppModule { }
