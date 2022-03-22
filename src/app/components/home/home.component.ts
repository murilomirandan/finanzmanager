import { Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { LoginDataService } from 'src/app/services/login-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements DoCheck {

  isAuthenticated: boolean;
  firstName: string;
  familyName: string;
  email: string;

  constructor(private loginDataService: LoginDataService) { }
  ngDoCheck(): void {
    this.getLoginData();
  }

  getLoginData(){
    this.loginDataService.receiveFirstNameData().subscribe(
      data => this.firstName = data
    );
    this.loginDataService.receiveFamilyNameData().subscribe(
      data => this.familyName = data
    );
    this.loginDataService.receiveEmailData().subscribe(
      data => this.email = data
    );
    this.loginDataService.receiveIsAuthenticatedData().subscribe(
      data => this.isAuthenticated = data
    );

    // console.log("HomeComponent: ", this.firstName, this.familyName, this.email, this.isAuthenticated);
  }
}
