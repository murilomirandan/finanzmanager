import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { OktaAuthStateService, OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { LoginDataService } from 'src/app/services/login-data.service';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = false;
  firstName: string;
  familyName: string;
  email: string;

  constructor(private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth,
    private loginDataService: LoginDataService) { }

  ngOnInit(): void {

    this.oktaAuthService.authState$.subscribe(
      (result) => {
        this.isAuthenticated = result.isAuthenticated;
        this.getUserDetails();
        this.sendData();
      }
    );
  }

  getUserDetails() {
    if(this.isAuthenticated){
      this.oktaAuth.getUser().then(
        (res) => {
          this.firstName = res.given_name;
          this.familyName = res.family_name;
          this.email = res.email;
        }
      )
    }
  }

  sendData() {
    if(this.isAuthenticated){
      this.oktaAuth.getUser().then(
        (res) => {
        // console.log("loginStatusComponent", JSON.stringify(res));
        this.loginDataService.sendData(res.given_name, res.family_name, res.email, this.isAuthenticated);
        }
      )
    }
  }

  logout() {
    this.oktaAuth.signOut();
  }
}
