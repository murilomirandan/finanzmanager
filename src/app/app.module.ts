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
import { SubheaderComponent } from './components/subheader/subheader.component';
import { SearchComponent } from './components/search/search.component';

const routes: Routes = [
  {path: 'home', component: HomeComponent},
  {path: 'einnahmen', component: EinnahmeComponent},
  {path: 'ausgaben', component: AusgabeComponent},
  {path: 'search/einnahmen/:keyword', component: EinnahmeComponent},
  {path: 'search/ausgaben/:keyword', component: AusgabeComponent},
  {path: '', redirectTo: '/home', pathMatch:'full'},
  {path: '**', redirectTo: '/home', pathMatch:'full'},
];

@NgModule({
  declarations: [
    AppComponent,
    EinnahmeComponent,
    HomeComponent,
    AusgabeComponent,
    SubheaderComponent,
    SearchComponent
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
  providers: [EinnahmeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
